function getCalendar()
{
  $(".date").flatpickr({
    enableTime: false,
    dateFormat: "D d/m/y",
    monthSelectorType: "static"
  });
}

// When the page is ready, all calendar fields are made clickable
$(document).ready(function () {
  getCalendar();
});