var month_olypic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//闰年每个月份的天数
var month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var month_name = ["January", "Febrary", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];
//获取以上各个部分的id
var holder = document.getElementById("days");
var prev = document.getElementById("prev");
var next = document.getElementById("next");
var ctitle = document.getElementById("calendar-title");
var cyear = document.getElementById("calendar-year");
//获取当天的年月日
var my_date = new Date();
var my_year = my_date.getFullYear();//获取年份
var my_month = my_date.getMonth(); //获取月份，一月份的下标为0
var my_day = my_date.getDate();//获取当前日期
var history = $('#history')
var key = 'a0202402aab857be42ff5d2bdb48db5a';
var ip = returnCitySN["cip"];

// $.get('http://apis.juhe.cn/ip/ipNew?ip=' + ip + '&key=c4bf7165943aed11647b6657fa27ae4d', function (data, status) {
//     city = data.result.City
//     city = city.slice(0, -1)
//     $('#city').html(city)
//     $.get('http://v.juhe.cn/weather/index?format=2&cityname=' + city + '&key=cd2bbdaa817f528419895325feb923b4', function (data, status) {
//         console.log(data);
//         var str = '';
//         var weather = data.result.future;
//         for (var i = 0; i < 3; i++) {
//             if (i == 0) {
//                 str += "<li><a>今天天气：" + weather[i].weather + "。 温度为：" + weather[i].temperature + "</a></li>"
//             } else if (i == 1) {
//                 str += "<li><a>明天天气：" + weather[i].weather + "。 温度为：" + weather[i].temperature + "</a></li>"
//             } else {
//                 str += "<li><a>后天天气：" + weather[i].weather + "。 温度为：" + weather[i].temperature + "</a></li>"
//
//             }
//         }
//         $('#weather').html(str);
//     }, 'jsonp');
//
// }, 'jsonp');

//万年历

//根据年月获取当月第一天是周几
function dayStart(month, year) {
    var tmpDate = new Date(year, month, 1);
    return (tmpDate.getDay());
}

//根据年份判断某月有多少天(11,2018),表示2018年12月
function daysMonth(month, year) {
    var tmp1 = year % 4;
    var tmp2 = year % 100;
    var tmp3 = year % 400;

    if ((tmp1 == 0 && tmp2 != 0) || (tmp3 == 0)) {
        return (month_olypic[month]);//闰年
    } else {
        return (month_normal[month]);//非闰年
    }
}

function refreshDate() {
    var str = "";
    //计算当月的天数和每月第一天都是周几，day_month和day_year都从上面获得
    var totalDay = daysMonth(my_month, my_year);
    var firstDay = dayStart(my_month, my_year);
    //添加每个月的空白部分
    for (var i = 0; i < firstDay; i++) {
        str += "<li>" + "</li>";
    }

    //从一号开始添加知道totalDay，并为pre，next和当天添加样式
    var myclass;
    for (var i = 1; i <= totalDay; i++) {
        //三种情况年份小，年分相等月份小，年月相等，天数小
        //点击pre和next之后，my_month和my_year会发生变化，将其与现在的直接获取的再进行比较
        //i与my_day进行比较,pre和next变化时，my_day是不变的
        console.log(my_year + " " + my_month + " " + my_day);
        console.log(my_date.getFullYear() + " " + my_date.getMonth() + " " + my_date.getDay());
        if ((my_year < my_date.getFullYear()) || (my_year == my_date.getFullYear() && my_month < my_date.getMonth()) || (my_year == my_date.getFullYear() && my_month == my_date.getMonth() && i < my_day)) {
            myclass = " class='lightgrey'";
        } else if (my_year == my_date.getFullYear() && my_month == my_date.getMonth() && i == my_day) {
            myclass = "class = 'green greenbox'";
        } else {
            myclass = "class = 'darkgrey'";
        }
        str += "<li " + myclass + " style='cursor: pointer;' onclick='getHistory(my_month+1," + i + ");getPreCalendear(my_year,my_month+1," + i + ")'>" + i + "</li>";
    }
    holder.innerHTML = str;
    ctitle.innerHTML = month_name[my_month];
    cyear.innerHTML = my_year;
}

//调用refreshDate()函数，日历才会出现
refreshDate();
//实现onclick向前或向后移动
pre.onclick = function (e) {
    e.preventDefault();
    my_month--;
    if (my_month < 0) {
        my_year--;
        my_month = 11; //即12月份
    }
    refreshDate();
}

next.onclick = function (e) {
    e.preventDefault();
    my_month++;
    if (my_month > 11) {
        my_month = 0;
        my_year++;
    }
    refreshDate();
}
var data = {};

function getHistory(month, day) {
    $.ajax({
        url: "http://v.juhe.cn/todayOnhistory/queryEvent.php?key=" + key + '&date=' + month + '/' + day,
        type: 'get',
        dataType: 'jsonp',
        success: function (res) {
            data = res.result;
            console.log(res)
            var num = data.length;
            if (num > 6) {
                num = 6
            }
            var str = ' <a href="#" style="text-align: center;font-size: 20px" class="list-group-item active">\n' +
                '                历史今天看' + "<div style='font-size: 10px'>日期： " + month + '月' + day + '日' + "</div>" + '</a>';
            for (var i = 0; i < num; i++) {
                str += '<div class=""><a href="#" class="list-group-item"><span>' + data[i].title + '</span><span style="float: right">' + data[i].date + '</span></a></div>'
            }
            $('#history').html(str);
        }

    })


}

// 万年历
function getPreCalendear(year, month, day) {
    $.ajax({
        url: 'http://v.juhe.cn/calendar/day?date=' + year + '-' + month + '-' + day + '&key=7e1fc6124b950cd3af170d09cc9dddb0',
        type: 'get',
        dataType: 'jsonp',
        success: function (res) {
            var data = res.result.data
            var sui = new Array();
            var avoid = new Array();
            sui = data.suit.split(".");
            avoid = data.avoid.split('.');
            var str1 = '';
            var str2 = '';
            for (var i = 0; i < sui.length - 1; i++) {
                str1 += '<li><a href="#">' + sui[i] + '</a></li>'
            }
            for (var i = 0; i < avoid.length - 1; i++) {
                str2 += '<li><a href="#">' + avoid[i] + '</a></li>'
            }
            $('#suit').html(str1);
            $('#avoid').html(str2);
        }
    })

}

// function getTopNews() {
//     var url = 'http://v.juhe.cn/toutiao/index?key=db170bdf6c35de476de82bd97d66d795'
//     $.ajax({
//         xhrFields: {
//             withCredentials: true    // 前端设置是否带cookie
//         },
//         crossDomain: true,   // 会让请求头中包含跨域的额外信息，但不会含cookie
//         url: url,
//         dataType: 'jsonp',
//         type: 'get',
//         success: function (res) {
//
//             console.log(res);
//         }
//     })
// }
//
// getTopNews();

getHistory(my_month + 1, my_day);
getPreCalendear(my_year, my_month + 1, my_day);

