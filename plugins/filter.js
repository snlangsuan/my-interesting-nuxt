import Vue from 'vue'
import numeral from 'numeral'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

Vue.filter('epochTime', function (value) {
  if (Number.isNaN(Number(value))) return '-:-'
  const duration = dayjs.duration(value)
  return ('00' + duration.minutes()).slice(-2) + ':' + ('00' + duration.seconds()).slice(-2) + '.' + ('000' + duration.milliseconds()).slice(-3)
});

Vue.filter('decimal', function (value, len = 1) {
  if (Number.isNaN(Number(value))) return '0.0'
  return numeral(value).format('0,0.' + ('0'.repeat(len)))
})
