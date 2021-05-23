var color_red = "rgb(255, 190, 184)";
var color_yellow = "rgb(255, 241, 184)";
var color_green = "rgb(184, 255, 186)";
//  multiplied by 10  A    A%  CD  C%  D    D%  EM   ER  HP    HP%
var stat_values =  [ [0, 140, 41, 54, 27, 160, 51, 160, 45, 2090, 41],
                     [0, 160, 47, 62, 31, 190, 58, 190, 52, 2390, 47],
                     [0, 180, 53, 70, 35, 210, 66, 210, 58, 2690, 53],
                     [0, 190, 58, 78, 39, 230, 73, 230, 65, 2990, 58] ];
var stat_diffs =     [0, 50,  17, 24, 12, 70,  22, 70,  20, 900,  17];
var max_allocs = 9;

function count_rolls(value, stat_index/*, start_index*/) {

    if (value < 0)
        return -1;
    else if (value == 0)
    {
        return 0;
    }

    for (let i = 0; i < 4; ++i)
    {
        let v = count_rolls(value - stat_values[i][stat_index], stat_index);
        if (v >= 0) return v + 1;
    }
}

function evaluate(el, id) {
    
    // make bitset of desired subsets 
    let desired = 0x00, desired_count = 0x00, ratingSum = 0x00, ratingIdv = 0x00;
    var i = 1;
    for (; i < 7; ++i)
        desired |= 0x01 << el.querySelector("#tss" + i).value;
    desired &= ~(0x01 << 0);    // clear last bit (NONE bit)

    try
    {
        // loop through each substat
        for (i = 1; i < 5; ++i)
        {
            ratingIdv = 0;

            // check for valid range
            let stat_index = el.querySelector("#ss" + i).value;
            let stat_value = el.querySelector("#iss" + i).value * 10;
            if (stat_value < stat_values[0][stat_index] || stat_value > stat_values[3][stat_index] * 6)
            {
                el.querySelector("#iss" + i).style.backgroundColor = color_red;
                throw "Invalid Stat";
            }

            // determine number of stat points that went into this
            let rolls = count_rolls(stat_value, stat_index);
            document.getElementById("rolls_" + id + "_" + i).innerHTML = rolls;

            // determine if this substat should be included
            if (!(desired & (0x01 << el.querySelector("#ss" + i).value)))
            {
                el.querySelector("#ss" + i).style.backgroundColor = color_yellow;
                el.querySelector("#iss" + i).style.backgroundColor = color_yellow;
                continue;
            }

            // valid range, do value processing here
            el.querySelector("#ss" + i).style.backgroundColor = color_green;
            el.querySelector("#iss" + i).style.backgroundColor = color_green;

            ratingIdv = (stat_value - stat_values[0][stat_index] * rolls) / stat_diffs[stat_index];

            ratingSum += ratingIdv;
            //alert(ratingIdv);
            ++desired_count;
        }
    }
    catch (err)
    {
        ratingSum = err;
    }


    // count current stat allocs and calculate current rating
    let stat_allocs = 4 + Math.floor(el.querySelector("#lvl").value / 4);
    let rst_curr = Math.round(ratingSum / stat_allocs * 10000) / 100;

    // determine worst-case scenario - rating sum does not increase but stat_allocs = 9 at +20
    let rst_min = Math.round(ratingSum / max_allocs * 10000) / 100;

    // determine best-case scenario - rating sum increases by 1 for each remaining stat_alloc until +20
    let rst_max = Math.round((ratingSum + max_allocs - stat_allocs) / max_allocs * 10000) / 100;

    // determine expected scenario - rating sum increases by 0.5 * selected stat % for each remaining stat_alloc until +20
    let rst_exp = Math.round((ratingSum + 0.5 * (max_allocs - stat_allocs) * (desired_count / 4)) / max_allocs * 10000) / 100;


    return [rst_curr, rst_min, rst_exp, rst_max];
}