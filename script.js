document.addEventListener('DOMContentLoaded', function() {
    var editorElement = document.getElementById('editor');

    var editor = new MyScript.Editor(editorElement, {
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
