document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    var fileInput = document.getElementById('fileInput');
    var editorElement = document.getElementById('editor');
    var editor;

    fileInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var dataURL = e.target.result;
                processImage(dataURL);
            };
            reader.readAsDataURL(file);
        }
    });

    function processImage(dataURL) {
        console.log('Processing image...');
        
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
            console.log('Initializing editor...');
            try {
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
                console.log('Editor initialized successfully');
            } catch (e) {
                console.error('Error initializing MyScript editor:', e);
            }
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            console.log('Importing image into editor...');
            if (editor) {
                editor.import_(e.target.result, 'image/png')
                    .then(() => console.log('Image imported successfully'))
                    .catch(err => console.error('Error importing image:', err));
            } else {
                console.error('Editor is not initialized');
            }
        };
        reader.readAsArrayBuffer(blob);
    }

    document.getElementById('convert').addEventListener('click', function() {
        console.log('Convert button clicked');
        
        if (editor) {
            console.log('Exporting text...');
            editor.export_('text/plain')
                .then(function(text) {
                    console.log('Exported text:', text);
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
