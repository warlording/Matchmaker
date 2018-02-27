$(document).ready(function() {
    // Questions listed in an array so they can be procedurally generated.
    var questions = [
        'I would consider myself a connoisseur of fine cheeses.',
        'I am gay.',
        'I am smart.',
        'I already have alot of friends.',
        'I like Die Hard.',
        'I have seen and loved every episode of The Office.',
        'I like Donald Trump.',
        'I support Donald Trump as President of the United States of America.',
        'I realize that even if I dont like Trump, he is still my president.',
        'America is great.'
    ];

    var choices = [
        '1 (Strongly Disagree)',
        '2 (Disagree)',
        '3 (Neutral)',
        '4 (Agree)',
        '5 (Strongly Agree)'
    ];

    var questionDiv = $('#questions');
    i = 0;

    questions.forEach(function (question) {
        i++;
        var item = $('<div class="question">');
        var headline = $('<h4>').text('Question ' + i);
        var questionText = $('<p>').text(question);
        var dropDown = $('<div class="form-group">');
        var select = $('<select class="form-control selector">');
        choices.forEach(function(choice) {
            var option = $('<option>').text(choice);
            select.append(option);
        });
        select.attr('id', 'select' + i);
        dropDown.append(select);
        item.append(headline, questionText, dropDown);
        var br = $('<br>');
        questionDiv.append(item, br);
    });

    $('#submit').on('click', function(event) {

        event.preventDefault();

        var userName = $('#userName').val();
        var imageLink = $('#imageLink').val();

        if (userName.length > 0 && imageLink.length >0) {
            var answers = [];

            Object.keys($('.selector')).forEach(function(key) {
                if (answers.length < questions.length) {
                    answers.push($('.selector')[key].value.charAt(0));
                }
            });

            var surveyData = {
                name: userName,
                photo: imageLink,
                answers: answers
            };

            $.post('/api/friends', surveyData, function(data) {

                if (data) {

                    $('#modalContent').empty();
                    $('#userName').val('');
                    $('#imageLink').val('');

                    data.forEach(function(profile) {
                        var profileDiv = $('<div class="profile">');
                        var name = profile.name;
                        var photoURL = profile.photo;
                        var nameHeader = $('<h3>').text(name);
                        var photo = $('<img>').attr('src', photoURL);
                        profileDiv.append(nameHeader, photo);

                        $('#modalContent').append(profileDiv);
                    });

                    if (data.length > 1) {
                        $('.modal-title').text('Your new friends');
                    } else {
                        $('.modal-title').text('The one person who will be your best friend');
                    }

                    $('#resultModal').modal();
                }
            });
        } else {
            $('#errorModal').modal();
            setTimeout(function() {
                $('#errorModal').modal('hide');
            }, 2000);
        }
    });
});