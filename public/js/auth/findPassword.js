let codeSendedEmail = "";

function validateInput () {
        const password = $("#password").val();

        if (password.length < 1 || password.length > 15 || /\s/.test(password)) {
                alert("비밀번호는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
                alert("비밀번는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }

        return true;
}

function sendAuthNum () {
        const email = $("#email").val();

        $.ajax({
                url: "/auth/send/email",
                method: "POST",
                dataType: "json",
                data: { email: email, purpose: "findPassword" }
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
        const div= $("#showDiv");
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
                data: { email: email, authCode: authCode, purpose: "findPassword" }
        })
        .done(function (data) {
                if (data.success) {
                        alert("인증에 성공했습니다.");
                        let insert_html = `
                            <form action="/login/findPassword?_method=PUT" method="POST" onsubmit="return validateInput()">
                                <label for="password">새 비밀번호</label>
                                <input type="hidden" id="email" name="email" value="${email}">
                                <input type="password" id="password" name="password" placeholder="password" required>

                                <button type="submit" class="create-button">비밀번호 만들기</button>
                            </form>
                        `;
                        div.html(insert_html);
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
})