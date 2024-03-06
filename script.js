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
                    postElement.css('background-color', userColor); // Apply user's color to message container
                    postElement.html(`
                        <h2 style="color: white;">${post.name}</h2>
                        <strong><h3 style="color: white;">${post.message}</h3></strong>
                    `);
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
                    title: 'Oops...',
                    text: 'An error occurred while fetching data. Please try again later.'
                });
            });
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
            title: 'Enter your name',
            input: 'text',
            inputAttributes: {
                required: 'required'
            },
            showCancelButton: false,
            confirmButtonText: 'Submit',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Save username to local storage
                localStorage.setItem('username', result.value);
                // Send message with username
                sendMessage(result.value);
            }
        });
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
            postElement.css('background-color', userColor); // Apply user's color to message container
            postElement.html(`
                <h2 style="color: white;">${username}</h2>
                <strong><h3 style="color: white;">${message}</h3></strong>
            `);
            $('#postsContainer').append(postElement);

            // Scroll to the bottom of the messages
            $('#postsContainer').scrollTop($('#postsContainer')[0].scrollHeight);

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
                    title: 'Oops...',
                    text: 'An error occurred while submitting the form. Please try again later.'
                });
            });
        });
    }

    // Fetch data initially and every 5 seconds
    fetchData();
    setInterval(fetchData, 5000);

    // Scroll to bottom on page load
    $(window).on('load', function() {
        $('#postsContainer').scrollTop($('#postsContainer')[0].scrollHeight);
    });

    // Add scroll-to-bottom button functionality
    $('#scrollButton').click(function() {
        $('html, body').animate({ scrollTop: $('#postsContainer')[0].scrollHeight }, 'slow');
        return false;
    });

    // Show/hide scroll button based on scroll position
    $(window).scroll(function() {
        const $scrollButton = $('#scrollButton');

        if ($(this).scrollTop() > 100) {
            $scrollButton.fadeIn();
        } else {
            $scrollButton.fadeOut();
        }

        // Show/hide scroll button based on scroll position relative to the bottom
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            $scrollButton.fadeOut();
        } else {
            $scrollButton.fadeIn();
        }

        // Show/hide scroll button based on scroll direction
        if ($(this).scrollTop() > 100 && $(this).scrollTop() > previousScroll) {
            $messageForm.fadeOut();
        } else {
            $messageForm.fadeIn();
        }
        previousScroll = $(this).scrollTop();
    });

    var previousScroll = 0;

    // Listen for enter key press in message input
    $('#messageInput').keypress(function(event) {
        if (event.which === 13 && !event.shiftKey) { // Check if Enter key is pressed and Shift key is not pressed
            event.preventDefault(); // Prevent form submission
            $('#submitForm').submit(); // Trigger form submission
        }
    });
});
