let codeSendedEmail = "";

function sendAuthNum () {
        const email = $("#email").val();

        $.ajax({
                url: "/auth/send/email",
                method: "POST",
                dataType: "json",
                data: { email: email, purpose: "findID" }
        })
        .done(function (data) {
                if (data.isEmailExists) {
                    if (data.success) {
                            codeSendedEmail = email;
                            alert("인증코드를 전송했습니다.");
                    } else {
                            alert("인증코드를 전송하는 과정에서 오류가 발생했습니다.");
                    }
                } else {
                        alert("데이터가 없는 이메일입니다.");
                }
        })
        .fail(function () {
                alert("서버 에러: 인증코드 전송 실패");
        });
}

function checkEmailAuth () {
        const div= $("#showID");
        const email = $("#email").val();
        const authCode = $("#authCode").val();

        if (codeSendedEmail !== email) {
                alert("이메일을 다시 작성해서 인증코드를 전송하세요.");
                return;
        }

        $.ajax({
                url: "/auth/verify/email",
                method: "POST",
                dataType: "json",
                data: { email: email, authCode: authCode, purpose: "findID" }
        })
        .done(function (data) {
                if (data.success) {
                        alert("인증에 성공했습니다.");
                        div.text("아이디: " + data.userID);
                } else {
                        alert("인증에 실패했습니다. 다시 시도해 주세요.");
                }
        })
        .fail(function () {
                alert("서버 에러: 인증코드 인증 실패");
        });
}

$(document).ready(function () {
  $('#sendAuthNumBtn').on('click', function () {
    sendAuthNum();
  });

  $('#checkEmailAuthBtn').on('click', function () {
    checkEmailAuth();
  });
});