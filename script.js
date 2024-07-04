document.addEventListener('DOMContentLoaded', function() {
    // Access camera
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var snapButton = document.getElementById('snap');
    var fileInput = document.getElementById('fileInput');
    var editorElement = document.getElementById('editor');
    var editor;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(err) {
            console.error("Error accessing camera: " + err);
        });

    snapButton.addEventListener('click', function() {
        context.drawImage(video, 0, 0, 640, 480);
        var dataURL = canvas.toDataURL('image/png');
        processImage(dataURL);
    });

    fileInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var dataURL = e.target.result;
            processImage(dataURL);
        };
        reader.readAsDataURL(file);
    });

    function processImage(dataURL) {
        // Convert base64 to blob
        var byteString = atob(dataURL.split(',')[1]);
        var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: mimeString });

        // Initialize MyScript editor with image
        if (!editor) {
            editor = new MyScript.Editor(editorElement, {
                recognitionParams: {
                    server: {
                        applicationKey: '777931cf-665a-49a8-90a0-f231394aebe2',
                        hmacKey: '5dd90f47-e6b5-4d7c-8bba-4130fda598f6'
                    },
                    iink: {
                        export: {
                            mimeTypes: ['text/plain']
                        }
                    }
                }
            });
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            editor.import_(e.target.result, 'image/png')
                .then(() => console.log('Image imported successfully'))
                .catch(err => console.error('Error importing image:', err));
        };
        reader.readAsArrayBuffer(blob);
    }

    document.getElementById('convert').addEventListener('click', function() {
        if (editor) {
            editor.export_('text/plain')
                .then(function(text) {
                    console.log(text);
                    alert('Recognized Text: ' + text);
                })
                .catch(function(err) {
                    console.error('Error exporting text:', err);
                });
        } else {
            console.error('Editor not initialized');
        }
    });
});
