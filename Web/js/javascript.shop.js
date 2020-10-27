var API="http://localhost:8001";

$(function() {
    if(localStorage.getItem("userdata")){
        var userdata=JSON.parse(localStorage.getItem("userdata"));
        $('#afterlogin').css("display","block");
        $('#afterloginusesrname').css("display","block");
        $('#beforelogin').css("display","none");
        $('#afterloginusesrname').html('<a>'+userdata.name+'</a>')
    }else{
        $('#afterlogin').css("display","none");
        $('#afterloginusesrname').css("display","none");
    }

      $('#afterlogin').click(function(e) {  
        $('#afterlogin').css("display","none");
        $('#beforelogin').css("display","block");
        $('#afterloginusesrname').css("display","none");
        localStorage.removeItem("userdata")
      });
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $('#register-form').submit(function(event) {
      event.preventDefault();
  
      var formEl = $(this);
      var submitButton = $('input[type=submit]', formEl);
        var formdata=formEl.serializeObject();
            formdata['role']="user";
      $.ajax({
        type: 'POST',
        url: API+'/user',
        accept: {
          javascript: 'application/javascript'
        },
        data: formdata,
        beforeSend: function() {
          submitButton.prop('disabled', 'disabled');
        }
      }).done(function(data) {
          if(data.Status==-1){
              alert("Email already registerd")
          }else{
            alert("Registered Successfully")
            submitButton.prop('disabled', false);
            $('#myModal').modal('hide');
          }
      });
    });

    
    $('#login-form').submit(function(event) {
        event.preventDefault();

        var formEl = $(this);
        var submitButton = $('input[type=submit]', formEl);
        $.ajax({
          type: 'POST',
          url: API+'/user/login',
          accept: {
            javascript: 'application/javascript'
          },
          data: formEl.serializeObject(),
          beforeSend: function() {
            submitButton.prop('disabled', 'disabled');
          }
        }).done(function(data) {
            if(data.Status==-1){
                alert("Invalid Credentials")
            }else if(data.Status==1){
              alert("Login Successfully")
              submitButton.prop('disabled', false);
              console.log(data.data.role,data.data)
              if(data.data.role=="admin"){
                window.location.replace("./admin/index.html");
              }else{
                localStorage.setItem("userdata",JSON.stringify(data.data))
                $('#afterlogin').css("display","block");
                $('#beforelogin').css("display","none");
                $('#afterloginusesrname').css("display","block");
                $('#afterloginusesrname').innerHTML=data.data.name
                $('#myModal').modal('hide');
              }
            }
        });
      });
  });

  function checkout(){
    if(localStorage.getItem("userdata")){
      window.location.href="checkout.html"
    }else{
      $('#myModal').modal('show');
    }
  }
  function checkout2(){
      var ss=sessionStorage;
      var user=JSON.parse(localStorage.getItem("userdata"));
      var cart = JSON.parse(ss.getItem('shopp-cart') );
        var shipping = parseInt(ss.getItem( "shipping-rates" ));
        var total = parseInt(ss.getItem( "shopp-total" ));
				var cartItems = cart.items; 
        var formdata={
          "userid":user.id,
        "items":cartItems,
        "total":total
        }
        $.ajax({
          type: 'POST',
          url: API+'/checkout',
          accept: {
            javascript: 'application/javascript'
          },
          data: formdata,
        }).done(function(data) {
            if(data.Status==-1){
                alert("Order failed,Try again")
            }else{
              alert("Your order is Received")
              ss.clear();
              window.location.href="index.html"
            }
        });
  }