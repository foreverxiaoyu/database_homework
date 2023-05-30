// 获得浏览器中session中的username,未设置为null
let username;
let user_id;
let video_tite;

let resources = $("#index_resources")
let video = $("#index_video")
let music = $("#index_music")
let doc = $("#index_doc")
let mine = $("#index_mine")
let video_left_autoplay = document.querySelector("#video_left_autoplay") //为原生js对象

let collection_list = [];
let liked_list = [];

$(document).ready(function () {
    let left_navs = document.getElementsByClassName('left_navs');
    for (let i = 0; i < left_navs.length; i++) {
        left_navs[i].addEventListener('mouseenter', function () {
            this.className = 'left_navs_chosed';
        })
        left_navs[i].addEventListener('mouseout', function () {
            this.className = 'left_navs';
        })
    }
    for (let t = 0; t < left_navs.length; t++) {
        switch (t) {
            case 4:
                left_navs[t].addEventListener('click', function () {
                    login_config()
                })
        }
    }

    //定时检测更新用户登录状态
    timer = setInterval(user_init, 1000);
    // window.addEventListener('message', function(event) {
    //   if (event.origin !== window.location.origin) return; // 必须校验消息来源
    //   if (event.data.type === 'login') {
    //     // 更新页面内容
    //    alert(event.data.username)
    // //   }
    // })  对应的login.js中未使用的通信方式

    let ball = $(".floating-ball")
    let container = $(".container")
    //为导航栏绑定事件
    let navs = $(".left_nav ul")
    navs.on('click', 'li', function () {
        var id = $(this).attr('id');
        // 根据 ID 匹配不同的事件
        switch (id) {
            case 'item1':
                close_all();
                resources.show();
                break;
            case 'item2':
                close_all();
                video.show();
                video_left_autoplay.play();
                break;
            case 'item3':
                close_all();
                music.show();
                break;
            case 'item4':
                close_all();
                doc.show();
                break;
            case 'item5':
                close_all();
                mine.show();
                break;
            default:
                // 如果都不匹配，不执行任何操作
                break;
        }
    })
    // 资源详情页
    ball.each(function () {
        let w = container.width();
        $(this).css("width", w * 0.15);
        $(this).css("height", w * 0.15);
    })
    setInterval(function () {
        ball.each(function () {
            moveBall($(this));
        })
    }, 1000)


    // 获取四个悬浮球元素
    let docBall = document.querySelector('#doc-ball');
    let videoBall = document.querySelector('#video-ball');
    let myBall = document.querySelector('#my-ball');
    let musicBall = document.querySelector('#music-ball');


    close_all()
    //默认主页为资源概述界面
    resources.show()
    // 为四个悬浮球元素绑定点击事件
    docBall.addEventListener('click', () => {
        resources.hide();
        doc.show();
    });

    videoBall.addEventListener('click', () => {
        // 点击视频悬浮球时的操作
        resources.hide();
        $("#video_left_autoplay").play();
        video.show();
    });

    myBall.addEventListener('click', () => {
        // 点击我的悬浮球时的操作
        resources.hide();
        mine.show();
    });

    musicBall.addEventListener('click', () => {
        // 点击音乐悬浮球时的操作
        resources.hide();
        music.show();
    });


    //登录球
    let login_user = $('#login')
    let user_profile = $('.user_profile')
    if (username !== null) {
        user_profile.children('#profile').text(localStorage.getItem('user_signature'))
        user_profile.find('#user_id').text(localStorage.getItem('user_id'))
    }
    login_user.on('click', function () {
        if (username === null) {
            login_config()
        } else {
            // ****** 打开管理界面******//
            window.open('/users_manage')
        }
    })
    login_user.on('mouseenter', function () {
        user_profile.css('opacity', '100%')
    })
    login_user.on('mouseleave', function () {
        user_profile.css('opacity', '0')
    })

    //……………………非“资源详情页”……………………//
    //video
    let play_status = $(".play_status");
    play_status.css("background-color", "green");
    //主页的视频
    video_left_autoplay.addEventListener("pause", function () {
        $(".play_status").css("background-color", "red");


    })
    video_left_autoplay.addEventListener("play", function () {
        $(".play_status").css("background-color", "green");


    })
    video_left_autoplay.addEventListener("click", function () {
    });
    //收藏
    $(".video_cards .video_card_text").each(function () {
        let this_video_card_id = $(this).attr("id");
        $(this).on('click', ".collection_icon", function () {     //事件委托
            let id = this_video_card_id
            let video_href = $(this).siblings('a').attr("href");//.siblings() 表示选中兄弟元素,

            if ($.inArray(id, collection_list) === -1) // 直接用in是不行的，in处理的是对象
            { //不要写成this.……，这个是dom对象
                if (send_collecting_request(id, video_href)) {
                    collection_list.push(id)
                    console.log('collection_list:' + collection_list)
                    $(this).css("background-image", "url('/static/icons/收藏后.png')"); // 不要加“../”
                    alert("收藏成功")
                } else {
                    alert("收藏失败，请你稍后再试！")
                }
            } else {
                // 发送请求取消收藏请求
                if (send_NoCollecting_request(id, video_href)) {
                    collection_list.splice($.inArray(id, collection_list), 1)  //splice(索引，数量)，splice（）在未找到是会删去最后一个元素，这里已经排除了这种情况
                    console.log('collection_list:' + collection_list)
                    $(this).css("background-image", "url('/static/icons/收藏.png')"); // 不要加“../”
                    alert("取消收藏成功")
                } else {
                    alert("收藏失败，请你稍后再试！")
                }

            }
        })
        $(this).on('click', ".likeit_icon", function () {
            let id = this_video_card_id
            //  let video_href = $(this).siblings('a').attr("href");

            if ($.inArray(id, liked_list) === -1)
                // { //不要写成this.……，这个是dom对象
                // if(send_Liking_request(id,video_href)){
                //     collection_list.push(id)
                //     console.log($.inArray(id, collection_list))
            {
                liked_list.push(id)
                $(this).css("background-image", "url('/static/icons/喜欢后.png')");
            } // 不要加“../”
                //     alert("已添加")
                // }
                // else
                // {
            // }

            else {
                // 发送请求取消喜欢的请求
                // if(send_NoLiked_request(id,video_href))
                // {
                //  collection_list.splice(this_video_card_id)
                $(this).css("background-image", "url('/static/icons/喜欢.png')"); // 不要加“../”
                // }
                // else
                // {
                // }
            }
        })
    })
    let rightBox = document.querySelector('.right-box');
    let isScrolling = false;

    rightBox.addEventListener('scroll', function () {
        isScrolling = true;
    });

    let scroll_t = setInterval(function () {
        if (isScrolling) {
            isScrolling = false;

            let visibleRows = Math.ceil(rightBox.clientHeight / 220);
            let totalRows = document.querySelectorAll('.row').length;

            if (visibleRows + rightBox.scrollTop >= totalRows) {
                // 加载更多数据
            }
        }
    }, 250);

// **********************“我的界面”控制********************//
    //左侧部分

    let user_options = $('.user-options')
    user_options.children('li').eq(0).on('click', function () {
        alert('更改信息')
    })
    user_options.children('li').eq(1).on('click', function () {
        reLoad()
    })

    //右侧部分
    let page_index_before = 0;
    let mine_righe_page_change = $(".mine_rightbox_chosed ul li")
    mine_righe_page_change.eq(0).css({
        'background-color': '#00215A', 'border': '#E4FEFF solid 1px',
        'box-shadow': '0 0 1rem .5rem #436495', 'color': '#F3F3F3', 'font-weight': '700'
    }) //eq()方法选择对应索引的元素
    mine_righe_page_change.each(function (index) {
        $(this).on("click", function () {
            mine_righe_page_change.eq(page_index_before).css({
                'background-color': 'unset', 'font-size': 'x-small', 'box-shadow': 'none', 'border': 'none'
                , 'color': 'white', 'font-weight': 'normal'
            })
            mine_righe_page_change.eq(index).css({
                'background-color': '#00215A', 'border': '#E4FEFF solid 1px',
                'box-shadow': '0 0 1rem .5rem #436495', 'color': '#F3F3F3', 'font-weight': '700'
            })
            page_index_before = index
        })
    })

    let command = $('.mine_command')
    let is_Nocommand = true
    let delete_icon = $('.delete_icon')
    command.on('click', function () {
        if (is_Nocommand) {
            is_Nocommand = false
            delete_icon.css('display', 'block')
        } else {
            is_Nocommand = true
            delete_icon.css('display', 'none')
        }
    })
    $('.record-block ul li').each(function () {
        $(this).children('.delete_icon').on('click', function () {
            let video_id = $(this).parent('li').attr('id')
            let video_href = $(this).siblings('#mine_video_card_text').children('a').attr('href')
            if (send_NoCollecting_request(video_id, video_href)) {
                console.log("delete:" + video_id)
                collection_list.splice(video_id)
                $(this).parent('li').remove()
                update_video_list()
            }
        })
    })

});

function login_config() {
    if (username === null) {
        if (confirm("您还未登入，是否登入用户")) {
            window.open("/login")
        }
    }
}

function cont() {
    return confirm("网站测试中，相关功能可能并不成熟，是否继续？");
}

// function user_init() {
//     $.get('/user_data', function(response) {
//       localStorage.setItem('username', response.username); // 使用响应中的用户名
//       localStorage.setItem('user_id', response.user_id);
//       localStorage.setItem('user_url',response.user_url); // 用户头像地址
//       // 在这里可以根据需要对获取到的数据进行处理
//       // 更新界面等操作
//         console.log(response)
//         console.log(response.user_avatar_url)
//                   window.close();
//     });
//
//     username = localStorage.getItem('username');
//     user_id = localStorage.getItem('user_id')
//     let user_head_img = localStorage.getItem('user_url')
//
//     if (username !== null) {
//         $('#id_n').text(username);
//         alert(`欢迎您:${username}`)
//         $('#id_p').css('background-image', 'url(' + user_head_img + ')')
//         console.log("user_id:" + user_id)
//         console.log(user_head_img)
//         $(".signature").text("欢迎您，" + username + "")
//         clearInterval(timer)
//         // 从后端获取该用户的收藏喜欢信息
//         let user = {
//             'user_id': user_id,
//             'username': username,
//         }
//         $.ajax({
//             type: 'POST',
//             url: '/resources/video/init',
//             contentType: 'application/json',
//             data: JSON.stringify(user),
//             success: function (response) {
//                 if (response.length === 0) $('#NoVideo').css('display', 'block')
//                 else $('#NoVideo').css('display', 'none')
//                 for (let i = 0; i < response.length; i++) {
//                     let videoId = response[i].video_id;
//                     collection_list.push(videoId); // 将 video_id 值添加到数组中
//                     console.log(response)
//                 }
//
//             },
//             error: function (e) {
//                 console.log(e)
//                 alert('用户信息获取失败！请检测登录状态或检测网络')
//             },
//             dataType: "json"
//         });
//     }
// }

function user_init() {
    username = localStorage.getItem('username');
    user_id = localStorage.getItem('user_id');
    let user_head_img = localStorage.getItem('user_url')
    user_head_img = "/static/" + user_head_img

  if (username !== null) {
      $('#id_n').text(username);
      alert(`欢迎您:${username}`)
      $('#id_p').css('background-image', 'url(' + user_head_img + ')')
      console.log("user_id:" + user_id)
      console.log(user_head_img)
      $(".signature").text("欢迎您，" + username + "")
      clearInterval(timer)
      // 从后端获取该用户的收藏喜欢信息
      let user = {
          'user_id': user_id,
          'username': username,
      }
      $.ajax({
          type: 'POST',
          url: '/resources/video/init',
          contentType: 'application/json',
          data: JSON.stringify(user),
          success: function (response) {
              if (response.length === 0) $('#NoVideo').css('display', 'block')
              else $('#NoVideo').css('display', 'none')
              for (let i = 0; i < response.length; i++) {
                  let videoId = response[i].video_id;
                  collection_list.push(videoId); // 将 video_id 值添加到数组中
                   $(".video_cards").find('#'+videoId).children('.collection_icon').css("background-image", "url('/static/icons/收藏后.png')")
              }
            console.log(collection_list)
          },
          error: function (e) {
              console.log(e)
              alert('用户信息获取失败！请检测登录状态或检测网络')
          },
          dataType: "json"
      });
  }
}
// 为每个悬浮球随机生成运动方向和速度
function getRandomPos() {
    var len = $(".floating-ball");
    var w = len.width() - 150; // 可移动范围
    var h = len.height() - 150;
    var left = Math.floor(Math.random() * w); // 随机生成位置
    var top = Math.floor(Math.random() * h);
    return {
        left: left,
        top: top
    };
}

function moveBall($ball) {
    var pos = getRandomPos();
    pos = getRandomPos();
    $ball.animate({
        left: pos.left,
        top: pos.top
    }, 5000, function () {
        moveBall($ball);
    });
}


// 发送收藏视频请求
function send_collecting_request(video_id, video_href) {
    let collect_video = {
        'user_id': user_id,
        'username': username,
        'video_href': video_href,
        'id': video_id
    }
    let static_flag = true
    $.ajax({
        type: 'POST',
        url: '/resources/video/collection_update',
        contentType: 'application/json',
        data: JSON.stringify(collect_video),
        success: function (response) {
            console.log(response)
            static_flag = true
        },
        error: function () {
            static_flag = false
        },
        dataType: "json"
    });
    return static_flag
}

//取消视频收藏
function send_NoCollecting_request(video_id, video_href) {
    let collect_video = {
        'user_id': user_id,
        'username': username,
        'video_tite': video_tite,
        'video_href': video_href,
        'id': video_id
    }
    let static_flag = true
    $.ajax({
        type: 'POST',
        url: '/resources/video/collecting_cancel',
        contentType: 'application/json',
        data: JSON.stringify(collect_video),
        success: function (response) {
            console.log(response)
            static_flag = true
        },
        error: function () {
            static_flag = false
        },
        dataType: "json"
    });
    return static_flag
}

// 检测collection-list中的内容，用于我的页面的局部更新
function update_video_list() {
    if (collection_list.length === 0) $('#NoVideo').css('display', 'block')
    else $('#NoVideo').css('display', 'none')
}

function close_all() {
    resources.hide()
    music.hide()
    doc.hide()
    mine.hide()
    video.hide()
    video_left_autoplay.pause()
}

function reLoad() {
    // 清除浏览器中的localStorage内容
    localStorage.clear();
    // 刷新页面
    location.reload();
}

document.ready = cont();


