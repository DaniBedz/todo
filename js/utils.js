function getCalendar()
{
  $(".date").flatpickr({
    enableTime: false,
    dateFormat: "D d/m/y",
    monthSelectorType: "static",
    disableMobile: true,
    onChange: function () {
      let taskId = this.input.id.replace(/\D/g, '');
      taskManager.updateDueDate(taskId, this.input.value);
      taskManager.render();
    }
  })
};