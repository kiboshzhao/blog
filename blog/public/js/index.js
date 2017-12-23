$(function(){
    var $loginBox=$('#loginBox');
    var $registerBox=$('#registerBox');
    var $userInfo=$('#userInfo');
    //切换到注册面板
    $loginBox.find('a.colMint').on('click',function(){
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登陆面板
    $registerBox.find('a.colMint').on('click',function(){
        $registerBox.hide();
        $loginBox.show();
    });
    //注册事件
    $registerBox.find('input:button').off('click')
    $registerBox.find('input:button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(res){
                //console.log(res);
                $registerBox.find('.colWarning').html(res.message);
                if(res.code===0){
                    //注册成功
                    setTimeout(function(){
                        $loginBox.show();
                        $registerBox.hide();
                    },1000);
                }
            }
        });
        return false;
    });
    //登录模块
    if ($loginBox.length){
        $loginBox.find('input:button').off('click')
        $loginBox.find('input:button').on('click',function(){
            $.ajax({
                type:'post',
                url:'/api/user/login',
                data:{
                    username:$loginBox.find('[name="username"]').val(),
                    password:$loginBox.find('[name="password"]').val()
                },
                dataType:'json',
                success:function(res){
                    $loginBox.find('.colWarning').html(res.message);
                    if(res.code===0){
                        //登录成功
                    window.location.reload();
                    }
                }
            });
        });
    }
    
    //退出
    $('#logout').on('click',function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(res){
                if(res.code===0){
                    window.location.reload();
                }
            }
        });
    });
    var $nav = $(".nav.navbar-nav>li")
    $nav.click(function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active")
    })
})


