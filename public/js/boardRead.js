$(document).on("click", ".reply-btn", function () {
  const replyInput = $(this).closest(".content").find(".reply-input");
  replyInput.toggle(); // 숨김/보임 토글
});

/*
$(document).ready(function () {
  // 답글 작성 버튼 클릭
  $(document).on("click", ".reply-btn", function () {
    const $replies = $(this).closest(".content").find(".replies");

    // 이미 입력창이 있으면 닫기(토글)
    if ($replies.find(".reply-input").length > 0) {
      console.log($replies.find(".reply-input").length);
      $replies.find(".reply-input").remove();
      return;
    }

    // 입력창 없으면 생성
    const replyHtml = `
      <div class="reply-input">
        <form action="" method="POST" class="downment-form">
          <input type="text" name="description" placeholder="답글을 입력하세요..." />
          <button class="submit-reply">작성</button>
        </form>

        <!-- 대댓글 목록 -->
        <div class="reply-section">
        
          <div class="comment reply">
            <div class="avatar">😃</div>
            <div class="content">
              <div class="author-date">
                <span class="author">홍길동</span>
                <span class="date">${new Date().toLocaleString()}</span>
                <span class="comment-actions">
                  <a href="" class="downment-update">수정</a>
                  <form action="" method="POST">
                    <button type="submit">삭제</button>
                  </form>
                </span>
              </div>
              <div class="text">대댓글 예시입니다.</div>
              <div class="actions">
                <button class="like-btn">좋아요</button>
                <span class="like-count">0</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    `;

    $replies.append(replyHtml);
    $replies.find("input").focus();
  });


  // 답글 등록 버튼 클릭
  $(document).on("click", ".submit-reply", function () {
    const $input = $(this).siblings("input");
    const replyText = $input.val().trim();
    if (!replyText) return;

    const replyHtml = `
      <div class="comment reply">
        <div class="avatar">YY</div>
        <div class="content">
          <div class="author-date">
            <span class="author">나</span>
            <span class="date">${new Date().toLocaleString()}</span>
          </div>
          <div class="text">${replyText}</div>
        </div>
      </div>
    `;

    // 입력창 바로 뒤에 대댓글 추가
    $(this).closest(".replies").append(replyHtml);

    // 입력창 삭제
    $(this).parent().remove();
  });
});
*/