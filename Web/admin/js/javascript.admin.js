var image;
var API="http://localhost:8001";
var updateproduct;
function productRemove(productid){
    $.ajax({
        type: 'DELETE',
        url: API+'/products/'+$(productid).data("string"),
        accept: {
          javascript: 'application/javascript'
        }
      }).done(function(data) {
       if(data.Status==1){
        alert("Product Deleted");
        getData();
       }
      });
}
function productedit(prod){
    var updateproduct=$(prod).data("string")
    localStorage.setItem("pdata",JSON.stringify($(prod).data("string")));
    document.getElementById("cat").value = updateproduct.category
    document.getElementById("price").value = updateproduct.price
    document.getElementById("name").value = updateproduct.name
    document.getElementById("submitbutton").innerHTML  = "Update"
    $('#cancelbutton').css("display","block");
    $('#resetbutton').css("display","none");
}
function catedit(cat){
    var updatecat=$(cat).data("string")
    localStorage.setItem("cdata",JSON.stringify($(cat).data("string")));
    document.getElementById("category").value = updatecat.name
    document.getElementById("submitbutton").innerHTML  = "Update"
    $('#cancelbutton').css("display","block");
}

$(function() {
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
getData();
getCategories();
getUserData();

function getData(){
$.getJSON( API+"/products", function( data ) {
    $("#tbody").innerHTML="";
 jsonArr =data.data;
if(jsonArr.length >0)
{
  let firstRow =jsonArr[1];
  let allKeys =Object.keys(firstRow);
var tblBody = document.getElementById("tbody");

//rows
jsonArr.forEach(function(row) {
    var productid;
    var prod=JSON.stringify(row);
   var newTr = document.createElement('tr');
   allKeys.forEach(function(key) {
      var newel = document.createElement('td');
      newel.innerHTML = row[key];
      newTr.appendChild(newel);
      if(key=="product_id"){
        productid=row[key];
      }
   });
   var newel1 = document.createElement('td');
   newel1.innerHTML = "<i class='fa fa-edit' onclick='productedit(this)' data-string='"+prod+"'></i>";
   newTr.appendChild(newel1);
   var newel2 = document.createElement('td');
   newel2.innerHTML = '<i class="fa fa-minus-circle" onclick="productRemove(this)" data-string="'+productid+'"></i>';
   newTr.appendChild(newel2);
  tblBody.appendChild(newTr); 
});  
}

$('#example').DataTable();

});
}

function getUserData(){
    $.getJSON( API+"/users", function( data ) {
     jsonArr =data;
    if(jsonArr.length >0)
    {
      let firstRow =jsonArr[1];
      let allKeys =Object.keys(firstRow);
    var tblBody = document.getElementById("tbody4");
    $("#tbody4").innerHTML="";
    //rows
    jsonArr.forEach(function(row) {
        var userid;
       var newTr = document.createElement('tr');
       allKeys.forEach(function(key) {
          var newel = document.createElement('td');
          newel.innerHTML = row[key];
          newTr.appendChild(newel);
          if(key=="id"){
            userid=row[key];
          }
       });
       var newel2 = document.createElement('td');
       newel2.innerHTML = '<i class="fa fa-eye" onclick="userorders(this)" data-string="'+userid+'"></i>';
       newTr.appendChild(newel2);
      tblBody.appendChild(newTr); 
    });  
    }
    
    $('#example3').DataTable();
    
    });
    }


function getCategories(){
    $.ajax({
        type: 'GET',
        url: API+'/all_categories',
        accept: {
          javascript: 'application/javascript'
        }
      }).done(function(data) {
        $('tbody3').innerHTML="";
        var $dropdown = $("#cat");
        $.each(data, function() {
            $dropdown.append($("<option />").val(this.name).text(this.name));
        });
        jsonArr =data;
        if(jsonArr.length >0)
        {
       
          let firstRow =jsonArr[0];
          let allKeys =Object.keys(firstRow);
        var tblBody = document.getElementById("tbody3");
        document.getElementById("tbody3").innerHTML="";

        //rows
        jsonArr.forEach(function(row) {
            var cat_id;
            var cat=JSON.stringify(row);
           var newTr = document.createElement('tr');
           allKeys.forEach(function(key) {
              var newel = document.createElement('td');
              newel.innerHTML = row[key];
              newTr.appendChild(newel);
              if(key=="id"){
                cat_id=row[key];
              }
           });
           var newel1 = document.createElement('td');
           newel1.innerHTML = "<i class='fa fa-edit' onclick='catedit(this)' data-string='"+cat+"'></i>";
           newTr.appendChild(newel1);
           var newel2 = document.createElement('td');
           newel2.innerHTML = '<i class="fa fa-minus-circle" onclick="catRemove(this)" data-string="'+cat_id+'"></i>';
           newTr.appendChild(newel2);
          tblBody.appendChild(newTr); 
        });  
    }
    $('#example2').DataTable();
      });
}
$('#add-product-form').submit(function(event) {
    event.preventDefault();
    var formEl = $(this);
    var reader = new FileReader();
    var formdata=formEl.serializeObject();
    if($('#submitbutton').text()=="Add"){
        reader.readAsDataURL(image);
            reader.onload = function(){
                  let fielToUpload = {
                    fileName: image.name,
                    fileType: image.type,
                    fileExtension: image.name.slice((image.name.lastIndexOf(".") - 1 >>> 0) + 2),
                    value: reader.result.split(',')[1]
                };
                formdata['image']=fielToUpload;
                  $.ajax({
                  type: 'POST',
                  url: API+'/products',
                  accept: {
                      javascript: 'application/javascript'
                  },
                  data: formdata,
                  }).done(function(data) {
                      image=null;
                      if(data.Status==1){
                          alert("Product Added");
                          getData();
                      }
                  });
            }
    }else if($('#submitbutton').text()=="Update"){
        if(image==null){
            updateproduct=JSON.parse(localStorage.getItem("pdata"));
            $.ajax({
                type: 'PATCH',
                url: API+'/products/'+updateproduct.product_id,
                accept: {
                    javascript: 'application/javascript'
                },
                data: formdata,
                }).done(function(data) {
                    image=null;
                    // if(data.Status==1){
                        alert("Product Updated");
                        getData();
                    // }
                });
        }else if(image!=null){
            updateproduct=JSON.parse(localStorage.getItem("pdata"));
            reader.readAsDataURL(image);
            reader.onload = function(){
                  let fielToUpload = {
                    fileName: image.name,
                    fileType: image.type,
                    fileExtension: image.name.slice((image.name.lastIndexOf(".") - 1 >>> 0) + 2),
                    value: reader.result.split(',')[1]
                };
                formdata['image']=fielToUpload;
                $.ajax({
                    type: 'PATCH',
                    url: API+'/products/'+updateproduct.product_id,
                    accept: {
                        javascript: 'application/javascript'
                    },
                    data: formdata,
                    }).done(function(data) {
                        image=null;
                        // if(data.Status==1){
                            alert("Product Updated");
                            getData();
                        // }
                    });
            }
        }
        
      
    }

  

  });
  $('#add-category-form').submit(function(event) {
    event.preventDefault();
    var formEl = $(this);
    var reader = new FileReader();
    var formdata=formEl.serializeObject();
    if($('#submitbutton').text()=="Add Category"){
        $.ajax({
            type: 'POST',
            url: API+'/add_category',
            accept: {
                javascript: 'application/javascript'
            },
            data: formdata,
            }).done(function(data) {
                if(data.Status==1){
                    alert("Category Added");
                    getCategories();
                }
            });
    } else if($('#submitbutton').text()=="Update"){
        var updatecat=JSON.parse(localStorage.getItem("cdata"));
        $.ajax({
            type: 'PATCH',
            url: API+'/category/'+updatecat.id,
            accept: {
                javascript: 'application/javascript'
            },
            data: formdata,
            }).done(function(data) {
                // if(data.Status==1){
                    alert("Category Updated");
                    getCategories();
                // }
            });
    }
  });
});
var jsonArr;
function preview_image(event) {
    image=event.target.files[0]
  }
function cancelbutton(){
    document.getElementById("cat").value = ""
    document.getElementById("price").value = ""
    document.getElementById("name").value = ""
    document.getElementById("submitbutton").innerHTML  = "Add"
    $('#cancelbutton').css("display","none");
    $('#resetbutton').css("display","block");
}

function userorders(userid){
    var user_id=$(userid).data("string")
    var modal = document.getElementById("ordersModal");

    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    var modal = document.getElementById("ordersModal");
  modal.style.display = "none";
}
$.getJSON( API+"/orders/"+user_id, function( data ) {
    var tblBody = document.getElementById("tbody5");
    tblBody.innerHTML=""
    jsonArr =data.data;
   if(jsonArr.length >0)
   {
     let firstRow =jsonArr[1];
     let allKeys =Object.keys(firstRow);

   //rows
   jsonArr.forEach(function(row,index) {
      var newTr = document.createElement('tr');
      allKeys.forEach(function(key) {
         var newel = document.createElement('td');
         if(key=="status"){
            newel.innerHTML = '<select value="'+row[key]+'" onchange="updatestatus('+index+')">'+
            '<option value="Pending">Pending</option>'+
            '<option value="Completed">Completed</option>'+
            '<option value="Ready to shipping">Ready to shipping</option>'+
            '<option value="Shipped">Shipped</option>'+
        '</select>';
          }else{
            newel.innerHTML = row[key];
          }
         newTr.appendChild(newel);
         
      });
     tblBody.appendChild(newTr); 
   });  
   }
   $('#example4').DataTable()

   });
}

window.onclick = function(event) {
    var modal = document.getElementById("ordersModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function adminlogout(){
    localStorage.removeItem("userdata")
    window.location.href="http://localhost:8080/Web/index.html"
}
function updatestatus(index){
$.ajax({
    type: 'PATCH',
    url: API+'/checkout/'+jsonArr[index].orderid,
    accept: {
        javascript: 'application/javascript'
    },
    data: {"status":document.getElementsByTagName("select")[index].value},
    }).done(function(data) {
        // if(data.Status==1){
            alert("Status Updated");
        // }
    });
}