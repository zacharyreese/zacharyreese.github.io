
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */


function copyEmailAndShowToast() {
    var toast = document.getElementById('toast');
    navigator.clipboard.writeText('zactreese@gmail.com');

    toast.textContent = 'Email Copied! 💌';
    toast.classList.add('show');
    setTimeout(function () {
        toast.classList.remove('show');
    }, 3000);
}