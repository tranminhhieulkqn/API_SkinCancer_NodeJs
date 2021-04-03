$(document).ready(function () {
    var viewModel = {};

    viewModel.fileData = ko.observable({
        dataURL: ko.observable(),
        // base64String: ko.observable(),
    });
    viewModel.multiFileData = ko.observable({
        dataURLArray: ko.observableArray(),
    });
    viewModel.onClear = function (fileData) {
        if (confirm('Are you sure?')) {
            fileData.clear && fileData.clear();
        }
        hide_show(false);
    };
    ko.applyBindings(viewModel);

    var dataAll = null;

    $("#but_upload").click(function (e) {
        hide_show(false);
        e.preventDefault();
        var formData = new FormData();
        var files = $('#file')[0].files;
        // Check file selected or not
        if (files.length > 0) {
            formData.append('imageFile', files[0]);
            document.getElementById("loading").style.display = "block";
            $.ajax({
                url: '/predictions',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log('Success!');
                    console.log(dataAll);
                    dataAll = data
                    draw_chart(dataAll, $('.form-control option:selected').val())
                    hide_show(true);
                },
            });
        } else {
            alert("Please select a file.");
        }
    });
    $("#file").change(function () {
        hide_show(false);
    });
    $("#exampleFormControlSelect").change(function () {
        var selected = $('.form-control option:selected').val();
        draw_chart(dataAll, selected)
    })
    var re = 0;

    function hide_show(show) {
        let x = document.getElementById("label_predicted_results");
        let y = document.getElementById("form_results");
        let z = document.getElementById("drag_label");
        if (show) {
            x.style.display = "flex";
            y.style.display = "block";
            z.style.display = "block";
        } else {
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";
        }
    }

    function draw_chart(data, model_name) {
        document.getElementById("loading").style.display = "block";
        $('#myChart').remove();
        $('#insert_chart').append('<canvas id="myChart" width="400" height="300"></canvas>');
        document.getElementById('predicted_results').innerHTML = 'Predicted results: ' + data['predicted label'];
        var canvas = document.getElementById('myChart');
        var ctx = canvas.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Benign', 'Malignant'],
                datasets: [{
                    label: 'Prediction Rate',
                    maxBarThickness: 100,
                    data: [data['scores']['Benign'], data['scores']['Malignant']],
                    backgroundColor: [
                        'rgba(53, 175, 86, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgb(53, 175, 86, 1)',
                        'rgb(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        document.getElementById("loading").style.display = "none";
    };
});