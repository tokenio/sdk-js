/**
 * Sample value generator
 */
class Sample {

    static string() {
        return Sample.stringOf(5);
    }

    static stringOf(length) {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";
        for( var i=0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}

export default Sample;
