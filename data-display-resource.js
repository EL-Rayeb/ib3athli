
 // Function to fetch data from Google Sheets
 function fetchData() {
    fetch('https://script.google.com/macros/s/AKfycbzOSgQUxpOhLOE8HYxtWau8QW2pr2lGpM5HrTd8WxYbrZ-oKYijqO6ioStlDmSxeuay/exec')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
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
        console.log('Username prompt displayed.'); // Log when username prompt is displayed
    }