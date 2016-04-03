$(document).ready(function() {
    $('#my-affix').affix({
        offset: {
            top: $('#my-affix').offset().top,
            bottom: function() {
                return (this.bottom =
                    $('.footer').outerHeight(true) + 40)
            }
        }
    });
});