// script.js

$(document).ready(function() {
    // Function to fetch data from Google Sheets
    function fetchData() {
        fetch('https://script.google.com/macros/s/AKfycbwLBXMYBtMrs-MqezrYUREZ4Ojyesk1aAlpjcs0fXmAtEWPQQNndH0MqlbFrDdkUppv/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const postsContainer = $('#postsContainer');
                postsContainer.empty();

                // Reverse the array of data
                // data.reverse();  // disabled for now

                // Iterate through the reversed data array to create HTML elements
                data.forEach(post => {
                    const postElement = $('<div>').addClass('message');
                    postElement.html(`
                        <h2>${post.name}</h2>
                        <strong><h3>${post.message}</h3></strong>
                        <p class="timestamp">${post.timestamp}</p>
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

    // Call fetchData function initially
    fetchData();

    // Handle form submission
    $('#submitForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Display a wait alert using SweetAlert2
        Swal.fire({
            title: 'Sending message...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });

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
