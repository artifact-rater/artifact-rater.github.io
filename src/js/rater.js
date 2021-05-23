var color_red = "rgb(255, 190, 184)";
var color_yellow = "rgb(255, 241, 184)";
var color_green = "rgb(184, 255, 186)";
var min_stat_values = [0, 14, 4.1, 5.4, 2.7, 16, 5.1, 16, 4.5, 209, 4.1];
var max_stat_values = [0, 19, 5.8, 7.8, 3.9, 23, 7.3, 23, 6.5, 299, 5.8];
var stat_diffs = [0, 5, 1.7, 2.4, 1.2, 7, 2.2, 7, 2, 90, 1.7];
var max_allocs = 9;

function evaluate(el) {
    
    // make bitset of desired subsets 
    let desired = 0x00, desired_count = 0x00, ratingSum = 0x00, ratingIdv = 0x00;
    var i = 1;
    for (; i < 6; ++i)
        desired |= 0x01 << el.querySelector("#tss" + i).value;
    desired &= ~(0x01 << 0);    // clear last bit (NONE bit)

    try
    {
        // loop through each substat
        for (i = 1; i < 5; ++i)
        {
            // determine if this substat should be included
            if (!(desired & (0x01 << el.querySelector("#ss" + i).value)))
            {
                el.querySelector("#ss" + i).style.backgroundColor = color_yellow;
                el.querySelector("#iss" + i).style.backgroundColor = color_yellow;
                continue;
            }

            // check for valid range
            let stat_index = el.querySelector("#ss" + i).value;
            let stat_value = el.querySelector("#iss" + i).value;
            if (stat_value < min_stat_values[stat_index] || stat_value > max_stat_values[stat_index] * 6)
            {
                el.querySelector("#iss" + i).style.backgroundColor = color_red;
                throw "Invalid Stat";
            }

            // valid range, do value processing here
            el.querySelector("#ss" + i).style.backgroundColor = color_green;
            el.querySelector("#iss" + i).style.backgroundColor = color_green;
            ratingIdv = (stat_value - min_stat_values[stat_index]) / stat_diffs[stat_index];

            ratingSum += ratingIdv;
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