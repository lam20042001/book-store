$(document).on("turbolinks:load", function () {
  setTimeout(function () {
    $(".alert").fadeOut();
  }, 3000);
});
$("#add-edit").validate({
  errorClass: "error",
  rules: {
    title: {
      required: true,
    },
    year: {
      required: true,
    },
    author: {
      required: true,
    },
    category: {
      required: true,
    },
    price: {
      required: true,
    },
    description: {
      required: true,
    },
    image: {
      extension: "jpg|jpeg|png|ico|bmp",
    },
    code: {
      required: true,
    },
    discount: {
      required: true,
    },
    minimum: {
      required: true,
    },
    expiry: {
      required: true,
    }
  },
  messages: {
    title: {
      required: "Add a title",
    },
    year: {
      required: "Add a year",
    },
    author: {
      required: "Add author",
    },
    category: {
      required: "Select a category",
    },
    price: {
      required: "Add a price",
    },
    image: {
      required: "Add an image",
    },
    description: {
      required: "Add description",
    },
    image: {
      extension:
        "Please upload file in these format only (jpg, jpeg, png, ico, bmp).",
    },
    code: {
      required: "Add a code",
    },
    discount: {
      required: "Add discount",
    },
    minimum: {
      required: "Add minimum",
    },
    expiry: {
      required: "Add expiry",
    }
  }
});
$("#user-signup-form").validate({
  errorClass: "error",
  errorElement: "div",
  rules: {
    name: {
      required: true,
      minlength: 3,
    },
    email: {
      required: true,
      email: true,
    },
    contact: {
      required: true,
      number: true,
    },
    password: {
      required: true,
      minlength: 6,
    },
    cpassword: {
      required: true,
      minlength: 6,
      equalTo: "#password",
    },
  },
  messages: {
    name: {
      required: "Please enter your name.",
      minlength: "Name should be at least 3 characters.",
    },
    contact: {
      required: "Please enter your phone number",
    },
    email: {
      required: "Please enter your email.",
      email: "The email should be in the format: abc@domain.com",
    },
    password: {
      required: "Please enter your Password.",
      minlength: "Password should be at least 6 characters.",
    },
    cpassword: {
      required: "Re-enter your Password.",
      equalTo: "Password is not matching!",
    },
  },
});
$("#user-login-form").validate({
  errorClass: "error",
  rules: {
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  },
  messages: {
    email: {
      required: "Please enter your email.",
      email: "The email should be in the format: abc@domain.com",
    },
    password: {
      required: "Please enter your Password.",
    },
  }, onfocusout: false,
  onkeyup: false
});
$("#admin-login-form").validate({
  errorClass: "error",
  rules: {
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  },
  messages: {
    email: {
      required: "Please enter your email.",
      email: "The email should be in the format: abc@domain.com",
    },
    password: {
      required: "Please enter your Password.",
    },
  },
});
$("#password").validate({
  errorClass: "error",
  rules: {
    password: {
      required: true,
      minlength: 6,
    },
    npassword: {
      required: true,
      minlength: 6,
    },
    cpassword: {
      required: true,
      minlength: 6,
      equalTo: "#cpassword",
    },
  },
  messages: {
    password: {
      required: "Please enter your Password.",
      minlength: "Password should be at least 6 characters.",
    },
    npassword: {
      required: "Please enter your Password.",
      minlength: "Password should be at least 6 characters.",
    },
    cpassword: {
      required: "Re-enter your Password.",
      equalTo: "Password is not matching!",
    },
  },
});

$("#add-address").validate({
  errorClass: "error",
  rules: {
    street: {
      required: true,
    },
    ward: {
      required: true,
    },
    district: {
      required: true,
    },
    city: {
      required: true,
    },
    contact: {
      required: true,
    }
  },
  messages: {
    street: {
      required: "Enter street",
    },
    ward: {
      required: "Enter ward",
    },
    district: {
      required: "Enter district",
    },
    city: {
      required: "Enter city",
    },
    contact: {
      required: "Enter contact number",
    },

  },
});
//
$("#confirmDeletion").click(function () {
  confirm("Are you sure?");
});
let slides = document.querySelectorAll(".home .slide");
let index = 0;
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#img-prvw").attr("src", e.target.result).width(100).height(100);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$("#image").change(function () {
  readURL(this);
});
function editProfile() {
  $("#edit-profile").toggleClass("d-none");
}
function addAddress() {
  $("#add-address").toggleClass("d-none");
}
function editAddress(index) {
  $("#edit-address-" + index).toggleClass("d-none");
}
function addToCart(proId) {
  $.ajax({
    url: "/cart/add/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        location.reload();
      } else {
        location.href = "/login";
      }
    },
  });
}
function removeFromCart(proId) {
  $.ajax({
    url: "/cart/delete/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}
function changeQuantity(proId, price, count, qty) {
  $.ajax({
    url: "/cart/change-quantity",
    data: {
      proId: proId,
      price: price,
      count: count,
      qty: qty
    },
    method: "post",
    success: (response) => {
      location.reload();
    },
  });
}
function addToWishlist(proId) {
  $("#" + proId + "-heart").toggleClass("fa-like");
  $.ajax({
    url: "/wishlist/add/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        if (response.item == "added") {
          $("#" + proId + "-heart").css({ color: "red", background: "white" });
        } else {
          $("#" + proId + "-heart").css({ color: "white" });
        }
        location.reload();
      } else {
        location.href = "/login";
      }
    },
  });
}
function addToCartAndRemove(proId) {
  $.ajax({
    url: "/cart/add/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        removeFromWishlist(proId);
        location.reload();
      }
    },
  });
}
function removeFromWishlist(proId) {
  $.ajax({
    url: "/wishlist/delete/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}
function selectAddress(addressIndex) {
  $.ajax({
    url: "/cart/place-order/select-address",
    method: "post",
    data: {
      addressIndex: addressIndex,
    },
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}
$("#payment-form").validate({
  errorClass: "error",
  rules: {
    payment: {
      required: true,
    },
  },
  messges: {
    payment: {
      required: "Select payment method",
    },
  },
  errorPlacement: function (error, element) {
    if (element.is(":radio")) {
      error.insertBefore($(element).parents(".pay-form"));
    } else {
      // This is the default behavior
      error.insertAfter(element);
    }
  },
});
$("#payment-form").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "/cart/payment",
    method: "post",
    data: $("#payment-form").serialize(),
    success: (response) => {
      location.href = "/cart/place-order/success";
    },
  });
});
function verifyPayment(payment, order) {
  $.ajax({
    url: "/cart/verify-payment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        location.href = "/cart/place-order/success";
      }
    },
  });
}
function cancelOrder(id) {
  $.ajax({
    url: "/orders/order-cancel/" + id,
    method: "get",
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}
function changeStatus(id) {
  let status = $("#update-order-status").val();
  $.ajax({
    url: "/admin/orders/change-status/" + id,
    method: "post",
    data: {
      status,
    },
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}
$(".alert-danger").fadeOut(5000);
$(".alert-success").fadeOut(5000);

$("#coupon-form").validate({
  errorClass: "error",
  rules: {
    coupon: {
      required: true,
    },
  },
  messages: {
    coupon: {
      required: "Please enter your coupon name.",
    },
  },
  submitHandler: function applyCoupon(form) {
    $.ajax({
      url: form.action,
      method: form.method,
      data: $(form).serialize(),
      success: (response) => {
        location.reload();
      },
    });
  },
});
//-------- search-bar
function hideSearchResults() {
  const searchResults = document.getElementById("search-results");
  const searchBar = document.getElementById("search-bar");
  searchResults.style.display = "none";
  searchBar.value = "";
}
function sendData(e, category) {
  const searchResults = document.getElementById("search-results");
  let match = e.value.match(/^[a-zA-Z0-9 ]*/);
  if (e.value == "") { searchResults.innerHTML = "No Product"; return; }
  if (match[0] == e.value) {
    $.ajax({
      url: "/search",
      method: "post",
      data: {
        payload: e.value,
        category: category
      },
      success: (response) => {
        let payload = response.payload;
        searchResults.style.display = "block";
        if (payload.length < 1) {
          searchResults.innerHTML = "No Product";
          return;
        }
        searchResults.innerHTML = "";
        payload.forEach((element, index) => {
          if (index > 0) searchResults.innerHTML += "<hr>";
          searchResults.innerHTML += `<div><a style="color:black; text-decoration:none" href="/products/product-details/${element._id}"><p class='h4'>${element.title}</p> <img width='50px' src='/public/images/product-img/${element.image}'> </a></div> <br>`;
        });
      },
    });
    return;
  }
  searchResults.innerHTML = "";
}
function copyToClipboard(id) {
  navigator.clipboard.writeText(id);
  alert('copy code ' + id + ' to clipboard');
}
