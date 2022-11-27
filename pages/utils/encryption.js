

export function encrypt(str, key) {
  var encrypted = "";
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    var k = key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(c ^ k);
  }
  return encrypted;
}




export function decrypt(str, key) {
  var decrypted = "";
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    var k = key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(c ^ k);
  }
  return decrypted;
}





