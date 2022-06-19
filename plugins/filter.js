import Vue from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

Vue.filter('epochTime', function (value) {
  if (Number.isNaN(Number(value))) return '-:-'
  const duration = dayjs.duration(value)
  return ('00' + duration.minutes()).slice(-2) + ':' + ('00' + duration.seconds()).slice(-2) + '.' + ('000' + duration.milliseconds()).slice(-3)
});
