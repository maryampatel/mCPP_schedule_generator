/*global $, document, parseInt, moment*/
$(document).ready(function () {
    "use strict";
    $(function () {
        $('.date-picker').datetimepicker({
            pickTime: false,
            format: "YYYY/MM/DD",
        });
    });
    $(function () {
        $('.time-picker').datetimepicker({
            pickDate: false,
            ormat: "hh:mm a",
            // defaultDate: "11/22/2013 00:00"
        });
    });
    $(function () {
        $('.duration-picker').datetimepicker({
            pickDate: false,
            format: "HH:mm",
            // defaultDate: "11/22/2013 00:00"
        });
    });
});


function calculate_start_date_and_time(start_date, start_time) {
    "use strict";
    start_time = ("0000" + start_time).slice(-8);
    var start_time_hours = parseInt(start_time.substr(0, 2), 10) + (start_time.substr(6, 2) === "pm" ? 12 : 0),
        start_time_minutes = start_time.substr(3, 2),
        start_year = start_date.substr(0, 4),
        start_month = start_date.substr(5, 2),
        start_day = start_date.substr(8);
    return moment(start_year + "-" + start_month + "-" + start_day + " " + start_time_hours + ":" + start_time_minutes + ":" + "00");
}

function subtract_time(moment_date_object, time_string) {
    "use strict";
    time_string = ("0000" + time_string).slice(-5);
    var time_string_hours = time_string.substr(0, 2),
        time_string_minutes = time_string.substr(3, 2);
    return moment(moment_date_object.format()).subtract('hours', parseInt(time_string_hours, 10)).subtract('minutes', parseInt(time_string_minutes, 10));
}

function add_time(moment_date_object, time_string) {
    "use strict";
    time_string = ("0000" + time_string).slice(-5);
    var time_string_hours = time_string.substr(0, 2),
        time_string_minutes = time_string.substr(3, 2);
    return moment(moment_date_object.format()).add('hours', parseInt(time_string_hours, 10)).add('minutes', parseInt(time_string_minutes, 10));
}

function getTimeOf(time, conditioningDate) {
    "use strict";
    // Check if the dates are different 
    if (time.format('MMMM Do YYYY') !== conditioningDate) {
        return time.format('h:mm a') + "(" + time.format('MMMM Do YYYY')  + ")";
    }
    return time.format('h:mm a');
}
function addToTable(rowInformation) {
    "use strict";
    var day = rowInformation.day,
        condStartDateAndTime = (rowInformation.condStartDateAndTime ? rowInformation.condStartDateAndTime.format('MMMM Do YYYY') : ""),
        pretreatment1InjectionTime = (rowInformation.pretreatment1InjectionTime ? getTimeOf(rowInformation.pretreatment1InjectionTime, condStartDateAndTime) : ""),
        pretreatment2InjectionTime = (rowInformation.pretreatment2InjectionTime ? getTimeOf(rowInformation.pretreatment2InjectionTime, condStartDateAndTime) : ""),
        firstMorphineTime = (rowInformation.firstMorphineTime ? getTimeOf(rowInformation.firstMorphineTime, condStartDateAndTime) : ""),
        firstRatOutOfBoxTime = (rowInformation.firstRatOutOfBoxTime ? getTimeOf(rowInformation.firstRatOutOfBoxTime, condStartDateAndTime) : ""),
        finishConditioningTime = (rowInformation.finishConditioningTime ? getTimeOf(rowInformation.finishConditioningTime, condStartDateAndTime) : ""),
        heroinInjectionTime = (rowInformation.heroinInjectionTime ? getTimeOf(rowInformation.heroinInjectionTime, condStartDateAndTime) : "");

    $(".results tbody").append("<tr><td>" + day + "</td><td>" + condStartDateAndTime + "</td><td>" + pretreatment1InjectionTime + "</td><td>" + pretreatment2InjectionTime + "</td><td>" + firstMorphineTime + "</td><td>" + firstRatOutOfBoxTime + "</td><td>" + finishConditioningTime + "</td><td>" + heroinInjectionTime + "</td></tr>");
}

function setUpTable() {
    "use strict";
    $(".results tbody").empty(); // Empty the table
    if ($('#pretreatment1').val() !== "") {
        $('.pretreatment1_label').text($('#pretreatment1').val()); // Label the pretreatment columns
        $('.results table').removeClass('hide-pretreatment-one'); // Remove the class that hides the table column
    } else {
        $('.results table').addClass('hide-pretreatment-one'); // Adds the class that hides the table column
    }
    if ($('#pretreatment2').val() !== "") {
        $('.pretreatment2_label').text($('#pretreatment2').val()); // Label the pretreatment columns
        $('.results table').removeClass('hide-pretreatment-two'); // Remove the class that hides the table column
    } else {
        $('.results table').addClass('hide-pretreatment-two'); // Adds the class that hides the table column
    }

    $(".results table").show(); // Show the table
}

function generateSchedule() {
    "use strict";
    // Setup variables. traditionally done at the top of a function
    var day = 1,
        time_in_box = '00:10',
        time_until_heroin = '03:15',
        time_until_morphine = '21:00',
        day_0_heroin,
        pretreatment1_injection_time,
        pretreatment2_injection_time,
        cond_end_time,
        total_end_time,
        heroin_injection_time,
        cond_start_date_and_time,
        input;

    // Rather that read the text field every time, I'm storing these in an object called input
    input = {
        cond_start_date: $('#cond_start_date').val(),
        cond_start_time: $('#cond_start_time').val(),
        number_of_days: parseInt($('#number_of_days').val(), 10),
        time_to_condition: $('#time_to_condition').val(),
        pretreatment1: $('#pretreatment1').val(),
        pretreatment1_time: $('#pretreatment1_time').val(),
        pretreatment2: $('#pretreatment2').val(),
        pretreatment2_time: $('#pretreatment2_time').val(),
    };

    setUpTable();

    cond_start_date_and_time = calculate_start_date_and_time(input.cond_start_date, input.cond_start_time);

    if (input.number_of_days > 0) {  // calculate time of heroin injection the day before (day 0) if the number of days is greater than 0
        day_0_heroin = subtract_time(cond_start_date_and_time, time_until_morphine);
        addToTable({
            day: 0,
            condStartDateAndTime: day_0_heroin,
            heroinInjectionTime: day_0_heroin,
        });
    }

    while (day <= input.number_of_days) {
        if (input.pretreatment1 !== "") {
            pretreatment1_injection_time = subtract_time(cond_start_date_and_time, input.pretreatment1_time);
        }
        if (input.pretreatment2 !== "") {
            pretreatment2_injection_time = subtract_time(cond_start_date_and_time, input.pretreatment2_time);
        }
        cond_end_time = add_time(cond_start_date_and_time, time_in_box);
        total_end_time = add_time(cond_end_time, input.time_to_condition);
        heroin_injection_time = add_time(cond_end_time, time_until_heroin);

        addToTable({
            day: day,
            condStartDateAndTime: cond_start_date_and_time,
            pretreatment1InjectionTime: pretreatment1_injection_time, //pretreatment1_injection_time is undefined if there is no pretreatment1
            pretreatment2InjectionTime: pretreatment2_injection_time, //pretreatment2_injection_time is undefined if there is no pretreatment2
            firstMorphineTime: cond_start_date_and_time,
            firstRatOutOfBoxTime: cond_end_time,
            finishConditioningTime: total_end_time,
            heroinInjectionTime: (day < 8 ? heroin_injection_time : undefined), // Pass the heroin injection time only if the day is less than 8, otherwise pass undefined
        });

        cond_start_date_and_time = add_time(add_time(heroin_injection_time, input.time_to_condition), time_until_morphine);
        day = day + 1;
    }
}
