
$(document).ready(function (){
    close_all();
    $("#login_window").show();
    $("#login_enroll").on("click",function (){
        close_all();
        $("#enroll_window").show();

    })
    $("#enroll_return").on("click",function (){
        close_all();
        $("#login_window").show();
    })
        console.log("3");
    //注册界面响应
    $("#enroll_enrolling").on("clilk",function (){
            let username  = $("#username").val();
          let password = $("#password").val();
          let email = $("#email").val();
          let study_password = $("#study_password").val();
          if (username === "" || password === "" || email === "" || study_password === "")
          {
              alert("不能为空！");
                return
          }
          //…………………………填充邮箱功能……………………………………//

            //…………………………end……………………………………//
        $.post("login",
        {
            "username" :username,
            "password" :password,
            "email":email,
            "study_password":study_password
        },
            function(data,status) {
                alert("注册成功！");
                close_all();
                $("#login_window").show();

            }
        )
    })

    //登录界面响应
    //jquery .on对应原js中 .addEventListener
    $("#submit_login").on('click', function() {
      let username = $("#username").val();
      let password = $("#password").val();
      let email = $("#email").val();
      let user_id
      let user_avatar_url
      if (username === "" || password === "") {
        alert("用户名或密码不能为空！");
        return;
      }

      $.post("login", {
        "email": email,
        "password": password,
      }, function(data, status) {
        // 在登录成功后，发送 AJAX 请求获取用户数据
        $.get('/user_data', function(response) {
          localStorage.setItem('username', response.username); // 使用响应中的用户名
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('user_url',response.user_url); // 用户头像地址
          localStorage.setItem('user_signature', response.user_signature);
          // 在这里可以根据需要对获取到的数据进行处理
          // 更新界面等操作
            window.parent.location.reload();
            console.log(response)
            console.log(response.user_avatar_url)
                      window.close();
        });
      });
    });
});
    // Flask 会将一次性消息存储在名为 flash 的 cookie 中，并在响应中发送该 cookie。
    // 可以使用 jQuery 插件来轻松地访问 cookie。例如，可以使用 jquery.cookie 插件来获取名为 flash 的 cookie 中存储的消息。

function close_all(){
    $("#enroll_window").hide();
    $("#login_window").hide();
}
