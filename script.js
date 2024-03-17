$(document).ready(function() {
    // Function to fetch data from Google Sheets
function fetchData() {
   fetch('https://script.google.com/macros/s/AKfycbzkUPuvLYnGs46DCLLoRZ4Ao0-i95nVP3_fuDA6mBxLPc2o0DjtkCvHwADLmsknNi_3/exec')
       .then(response => {
           if (!response.ok) {
               throw new Error('Network response was not ok');
           }
           return response.json();
       })
       .then(data => {
           const postsContainer = $('#postsContainer');
           const isScrolledToBottom = postsContainer[0].scrollHeight - postsContainer.scrollTop() === postsContainer.outerHeight();

           // Clear previous messages
           postsContainer.empty();

           // Iterate through the data array to create HTML elements
           data.forEach(post => {
               const postElement = $('<div>').addClass('message');
               let userColor = getUserColor(post.name); // Get user's color based on name
               const storedUsername = localStorage.getItem('username');
               if (storedUsername===post.name) {
                   // If username is not stored, prompt user to input their name
                   postElement.html(`
                   <fieldset style=" border:5px solid ${userColor+"50"}; border-top-right-radius: 10px; border-top-left-radius: 10px; border-bottom-left-radius: 10px;padding:5px; float: right; width:85%; margin-top:5px;margin-bottom:5px;background-color: ${userColor+"20"};   ">
                   <legend style="color:#fff;background-color: ${userColor+"50"}; padding: 5px ; border-top-left-radius: 10px; border-bottom-right-radius: 10px; float:right;" >${post.name} <i class="fa fa-check-double"></i></legend>
                   <div style="">
                   <strong>
                   <h3 style="color:#383838;padding:5px;">${post.message} </h3>
                   </strong></div>
                   </fieldset>
               `);
               } else {
                   // If username is stored, use it to send messages
                   postElement.html(`
                   <fieldset style=" border:5px solid ${userColor+"50"}; border-top-right-radius: 10px; border-top-left-radius: 10px;width:85%; border-bottom-right-radius: 10px;padding:5px;display:block;background-color: ${userColor+"20"};">
                   <legend style="color:#fff;background-color: ${userColor+"50"}; padding: 5px ; border-bottom-left-radius: 10px; border-top-right-radius: 10px;position:absolute;">${post.name} <i class="fa fa-check-double"></i></legend>

                   <div style="margin-top:30px">
                   <strong>
                   <h3 style="color:#383838;padding:5px;">${post.message} </h3>
                   </strong></div>
                   </fieldset>
               `);
               }
               postsContainer.append(postElement);
           });

           // Scroll to the bottom if previously scrolled to the bottom
           if (isScrolledToBottom) {
               postsContainer.scrollTop(postsContainer[0].scrollHeight);
           }
       })
       .catch(error => {
           console.error('Error fetching data:', error);
           // Display an error message using SweetAlert2
           Swal.fire({
               icon: 'error',
               title: 'Connection Failure !',
               text: 'You are not online. Please try again later.'
           });
       });
}
   // Check if username is already stored in local storage
   const storedUsername = localStorage.getItem('username');
   if (!storedUsername) {
       // If username is not stored, prompt user to input their name
       promptForUsername();
   } else {
       // If username is stored, use it to send messages
       sendMessage(storedUsername);
   }

   // Function to prompt user for username
   function promptForUsername() {
       Swal.fire({
           icon: 'warning',
           title: 'username',
           showConfirmButton:false,
           showCancelButton: false,
           allowOutsideClick: false,
           allowEscapeKey: false,
       }).then((result) => {
           if (result.isConfirmed) {
               // Save username to local storage
               localStorage.setItem('username', result.value);
               // Send message with username
               sendMessage(result.value);
           }
       });
       console.log('Username prompt displayed.'); // Log when username prompt is displayed
   }
   // Function to generate a color based on the hash code of the name
   function getUserColor(username) {
       // Generate hash code
       let hash = 0;
       for (let i = 0; i < username.length; i++) {
           hash = username.charCodeAt(i) + ((hash << 5) - hash);
       }
       // Convert hash code to hex color
       let color = '#';
       for (let i = 0; i < 3; i++) {
           let value = (hash >> (i * 8)) & 0xFF;
           color += ('00' + value.toString(16)).substr(-2);
       }
       return color;
   }

   // Function to send message with username
   function sendMessage(username) {
       // Handle form submission
       $('#submitForm').submit(function(event) {
           event.preventDefault(); // Prevent default form submission behavior

           // Fetch data from the form
           const formData = new FormData(this);
           formData.append('name', username); // Append username to form data

           // Get message from form data
           const message = formData.get('message');

           // Append the message to the chat window with the user's color
           const postElement = $('<div>').addClass('message');
           const userColor = getUserColor(username); // Get user's color based on name
               // If username is not stored, prompt user to input their name
               postElement.html(`
               </fieldset>
               <fieldset style=" border:5px solid ${userColor+"50"}; border-top-right-radius: 10px; border-top-left-radius: 10px; border-bottom-left-radius: 10px;padding:5px; float: right; width:85%; margin-top:5px;margin-bottom:5px;background-color: ${userColor+"20"};   ">
               <legend style="color:#fff;background-color: ${userColor+"50"}; padding: 5px ; border-top-left-radius: 10px; border-bottom-right-radius: 10px; float:right;" >${username} <i class="fa fa-chevron-down"></i></legend>

               <div style="">
               <strong>
               <h3 style="color:#383838;padding:5px;text-size-adjust: 100%;">${message} </h3>
               </strong></div>
               </fieldset>
           `);

           $('#postsContainer').append(postElement);

           // Scroll to the bottom of the messages
           $('html, body').animate({ scrollTop: $('#postsContainer')[0].scrollHeight }, 'slow');

           // Clear the message input
           $('#messageInput').val('');

           // Submit form data to the server
           fetch(this.action, {
               method: 'POST',
               body: formData
           })
           .then(response => {
               if (!response.ok) {
                   throw new Error('Network response was not ok');
               }
               // Optionally, you can handle successful submission here
           })
           .catch(error => {
               console.error('Error submitting form:', error);
               // Display an error message using SweetAlert2
               Swal.fire({
                   icon: 'error',
                   title: 'Message is not sent',
                   text: 'Your internet connection is weak. Please try again later.',
                   text: 'Please try again later.'
               });
           });
       });
   }

   // Fetch data initially and every 2 seconds
   fetchData();
   setInterval(fetchData, 4000);

   // Scroll to bottom submit button
   $('#sendButton').click(function() {
       $('html, body').animate({ scrollTop: $('#postsContainer')[0].scrollHeight }, 'slow');
   });

   // Add scroll-to-bottom button functionality
   $('#scrollButton').click(function() {
       $('html, body').animate({ scrollTop: $('#postsContainer')[0].scrollHeight }, 'slow',);
       return false;
   });

   // Show/hide scroll button based on scroll position
   $(window).scroll(function() {
       const $scrollButton = $('#scrollButton');

       if ($(this).scrollTop() < 100) {
           $scrollButton.fadeOut();
       } else {
           $scrollButton.fadeIn();
       }

       // Show/hide scroll button based on scroll position relative to the bottom
       if ($(window).scrollTop() + $(window).height() == $(document).height()) {
           $scrollButton.fadeIn();
       } else {
           $scrollButton.fadeOut();
       }

       // Show/hide scroll button based on scroll direction
       if ($(this).scrollTop() < 100 && $(this).scrollTop() > previousScroll) {
           $scrollButton.fadeIn();
       } else {
           $scrollButton.fadeOut();
       }
       previousScroll = ($(this).scrollTop());
   });

   var previousScroll = 1;

   let scrollingDown = true; // Flag to track scrolling state

   function scrollDown() {
       if (scrollingDown) {
           window.scrollBy(0, 15); // Scroll down by 15 pixels
           requestAnimationFrame(scrollDown);
       }
   }

   // Start the infinite scroll
   scrollDown();

   // Listen for scroll events
   window.addEventListener("scroll", () => {
       // Check if the user has scrolled up
       if (window.scrollY < lastScrollY) {
           // Stop the infinite scroll
           scrollingDown = false;
       }
       lastScrollY = window.scrollY; // Update last scroll position
   });

   let lastScrollY = window.scrollY; // Initialize last scroll position
});