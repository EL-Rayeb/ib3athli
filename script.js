// script.js

$(document).ready(function() {
    // Prompt user to input their name on page load
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
            // Continue to fetch data and handle form submission
            fetchData();
        }
    });

    // Function to fetch data from Google Sheets
    function fetchData() {
        fetch('https://script.google.com/macros/s/AKfycbw0n75DvLHhucb6PUzAqeCVFVWjk2HtD72W58MpkY0EstKv9Ror80YruyceZWdJbo-J/exec')
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
            })
            .finally(() => {
                // Schedule the next data fetch in 4 seconds
                setTimeout(fetchData, 4000);
            });
    }

    // Handle form submission
    $('#submitForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Fetch data from the form
        const formData = new FormData(this);

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
                // Reload the page after a successful submission
                setTimeout(() => {
                    location.reload();
                }, 3000);
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
});
