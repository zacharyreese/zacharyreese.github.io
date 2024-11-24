
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */


function copyEmailAndShowToast() {
    navigator.clipboard.writeText('zactreese@gmail.com');
    
    const toast = document.getElementById('toast');
    toast.textContent = 'Email Copied! 💌';
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}