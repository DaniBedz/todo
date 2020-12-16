function getCalendar()
{
  $(".date").flatpickr({
    enableTime: false,
    dateFormat: "D d/m/y",
    // allowInput: true,
    // allowInvalidPreload: true,
    monthSelectorType: "static"
  });
}
$(document).ready(function () {
  getCalendar();
});