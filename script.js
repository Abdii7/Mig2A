document.addEventListener('DOMContentLoaded', function() {
    var editorElement = document.getElementById('editor');

    var editor = new MyScript.Editor(editorElement, {
        recognitionParams: {
            server: {
                applicationKey: 'YOUR_APPLICATION_KEY',
                hmacKey: 'YOUR_HMAC_KEY'
            },
            iink: {
                export: {
                    mimeTypes: ['text/plain']
                }
            }
        }
    });

    document.getElementById('convert').addEventListener('click', function() {
        editor.export_('text/plain')
            .then(function(text) {
                console.log(text);
                alert('Recognized Text: ' + text);
            })
            .catch(function(err) {
                console.error(err);
            });
    });
});
