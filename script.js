// script.js

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
                postsContainer.empty();

                // Iterate through the data array to create HTML elements
                data.forEach(post => {
                    const postElement = $('<div>').addClass('message');
                    postElement.html(`
                        <h2>${post.name}</h2>
                        <strong><h3>${post.message}</h3></strong>
                    `);
                    postsContainer.append(postElement);
                });
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

    // Check if username is already stored in local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        // If username is stored, use it
        sendMessage(storedUsername);
    } else {
        // Prompt user to input their name
        promptForUsername();
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
        // Continue to fetch data and handle form submission
        fetchData();

        // Handle form submission
        $('#submitForm').submit(function(event) {
            event.preventDefault(); // Prevent default form submission behavior

            // Fetch data from the form
            const formData = new FormData(this);
            formData.append('name', username); // Append username to form data

            // Submit form data to the server
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Clear the form input after successful submission
                    this.reset();
                    // Show success message using SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your message has been sent successfully.',
                        timer: 3000,
                        timerProgressBar: true
                    });
                } else {
                    throw new Error(`Form submission failed: ${response.statusText}`);
                }
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

    // Prompt user for username on page load
    promptForUsername();
});
