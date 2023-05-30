$(document).ready(function(){
    let user_id = localStorage.getItem('user_id')
    let username = localStorage.getItem('username')

    // Get the list items and dropdowns
    let emailItem = $("#email-item");
    let emailDropdown = $("#email-dropdown");
    let addressItem = $("#address-item");
    let addressDropdown = $("#address-dropdown");
    let enterpriseItem = $("#enterprise-item");
    let enterpriseDropdown = $("#enterprise-dropdown");
    let stu_idItem = $("#stu_id-item");
    let stu_idDropdown = $("#stu_id-dropdown");
    let useravatarItem = $("#user_avatar-item");
    let useravatarDropdown = $("#user_avatar-dropdown");

    // Get the input fields and buttons
    let emailInput = $("#email-input");
    let emailButton = $("#email-button");
    let addressInput = $("#address-input");
    let addressButton = $("#address-button");
    let enterpriseInput = $("#enterprise-input");
    let enterpriseButton = $("#enterprise-button");

    let stu_idInput = $("#stu_id-input");
    let stu_idButton = $("#stu_id-button");
    let useravatarInput = $("#user_avatar-input");
    let useravatarButton = $("#user_avatar-button");


    let user_list_item = $('.user-list-item')
    user_list_item.each(function (){
        $(this).children('img').on('click',function (){
            $(this).siblings('.user-list-item-dropdown').css('display','block')
        })
        $(this).children('.user-list-item-dropdown').children('button').eq(1).on('click',function (){
            $(this).parent('.user-list-item-dropdown').css('display','none')
        })
    })

    // Change the list item value when clicking on the buttons
    emailButton.click(function() {
    let newEmail = emailInput.val();
    if (change_email(user_id,newEmail)) {
     emailItem.find(".user-list-item-value").text(newEmail);
     emailInput.val("");
     alert("Email changed successfully!");
    } else {
     alert("Email changed successfully!");
    }

    });

    addressButton.click(function() {
    let newAddress = addressInput.val();
    if (change_address(user_id,newAddress)) {
    addressItem.find(".user-list-item-value").text(newAddress);
    addressInput.val("");
    alert("Address changed successfully!");
    } else {
    alert("Address changed successfully!");
    }
    });

    enterpriseButton.click(function() {
    let newEnterprise = enterpriseInput.val();
    if (change_enterprise(user_id,newEnterprise)){
    enterpriseItem.find(".user-list-item-value").text(newEnterprise);
    enterpriseInput.val("");
    alert("Enterprise changed successfully!");
    } else {
    alert("Enterprise changed successfully!");
    }
    });

    stu_idButton.click(function() {
    let newstu_id = stu_idInput.val();
    console.log(user_id)
    console.log(newstu_id)
    if (change_stu_id(user_id,newstu_id) !== 'true') {
    enterpriseItem.find(".user-list-item-value").text(newstu_id);
    enterpriseInput.val("");
    alert("stu_id changed successfully!");
    } else {
    alert("stu_id changed successfully!");
    }
    });

    useravatarInput.on("change", function() {
          var file = this.files[0]; // Get the selected file
          // Create a new FormData object
          var formData = new FormData();
          formData.append("avatar", file); // Append the file to the FormData object

        alert("ok")

      $.ajax({
        url: "/upload-avatar", // Replace with your server-side endpoint for handling the avatar upload
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
          console.log("Avatar uploaded successfully!");
        },
        error: function(e) {
          console.log(e)
        }
      });
    })
    // Add more event handlers here
    $('.return_btn').on('click',function (){
        window.parent.location.reload()
        window.close()
    })

})


function change_stu_id(user_id,changed_data){
    let sta = false;
    let data = {
    'user_id':user_id,
    'stu_id':changed_data,
    }
    $.ajax({
        url: "/upload-stu_id", // Replace with your server-side endpoint for handling the avatar upload
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          console.log("Avatar uploaded successfully!");
          sta = true;
        },
        error: function(xhr, status, error) {
          console.error("Error uploading avatar:", error);
          sta = false;
        }
      });
    return sta
}
function change_email(user_id,changed_data){
        let sta = 'false';
        let data = {
            'user_id':user_id,
            'email':changed_data,
        }
    $.ajax({
        url: "/upload-email", // Replace with your server-side endpoint for handling the avatar upload
        type: "POST",
        data: JSON.stringify(data),
        contentType:'application/json',
        success: function() {
          console.log("email uploaded successfully!");
                    sta =  'true'
        },
        error: function() {
          console.log("error")
                    sta =  'false'
        }
      });
       return sta
}
function change_address(user_id,changed_data){
        let sta = false;
        let data = {
        'user_id':user_id,
        'address':changed_data,
    }
    $.ajax({
        url: "/upload-address", // Replace with your server-side endpoint for handling the avatar upload
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          console.log("address uploaded successfully!");
                    sta =  true
        },
        error: function(xhr, status, error) {
          console.error("Error uploading address:", error);
                    sta =  false
        }
      });
        return sta
}
function change_enterprise(user_id,changed_data){
        let sta = false;
        let data = {
        'user_id':user_id,
        'enterprise':changed_data,
    }
    $.ajax({
        url: "/upload-enterprise", // Replace with your server-side endpoint for handling the avatar upload
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          console.log("enterprise uploaded successfully!");
                    sta =  true
        },
        error: function(xhr, status, error) {
          console.error("Error uploading enterprise:", error);
                    sta =  false
        }
      });
        return sta
}