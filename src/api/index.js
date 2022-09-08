import helper from './helper.js';

export default {
  // 출석 기록
  check_in : ({ discord_id, discord_channel_id }) => 
    helper.API().post('/check-in', { discord_id, discord_channel_id }),
  // 지갑주소 등록
  register : ({ discord_id, discord_channel_id, user_address }) => 
    helper.API().post('/register', { discord_id, discord_channel_id, user_address }),
  // 오늘까지 체크인한 기록 리스트 조회
  show_my_checkIns : ({ discord_channel_id, discord_id }) => 
    helper.API().get(`/show-my-checkins/${discord_channel_id}/${encodeURIComponent(discord_id)}`),
  // [admin] 현재까지의 출석부 리스트 조회
  show_list : ({ discord_channel_id, condition_count}) =>
    helper.API().get(`/show-list/${discord_channel_id}/${condition_count}`),
  // [admin] 수료증 NFT 발행
  issue_certificate : ({ discord_channel_id, condition_count, token_uri }) =>
    helper.CONTRACT_API().post('/issue-certificate', { discord_channel_id, condition_count, token_uri })
}
