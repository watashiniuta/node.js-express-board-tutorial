let isDuplicated = true;
let lastCheckedID = "";

let unAuthemail = true;
let codeSendedEmail = "";
let codeCheckedEmail = "";
let submitNowEmail = "";

function checkDuplicate () {
        const userID = $("#userID").val();

        if (userID.length < 1 || userID.length > 15 || /\s/.test(userID)) {
                alert("아이디는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(userID)) {
                alert("아이디는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }


        $.ajax({
                url: "/login/id_check",
                method: "POST",
                dataType: "json",
                data: { userID: userID }
        })
        .done(function (data) {
                if (data.exists) {
                        alert("이미 존재하는 아이디입니다.");
                        isDuplicated = true;
                        lastCheckedID = "";
                } else {
                        alert("사용 가능한 아이디입니다.");
                        isDuplicated = false;
                        lastCheckedID = userID;
                }
        })
        .fail(function () {
                alert("서버 에러: 중복 확인 실패");
        });
}

function sendAuthNum () {
        const email = $("#email").val();

        $.ajax({
                url: "/auth/send/email",
                method: "POST",
                dataType: "json",
                data: { email: email, purpose: "register" }
        })
        .done(function (data) {
                if (data.isEmailExists) {
                        alert("이미 사용중인 이메일입니다. 다른 이메일을 사용해 주세요.");
                } else {
                        if (data.success) {
                                codeSendedEmail = email;
                                alert("인증코드를 전송했습니다.");
                        } else {
                                alert("인증코드 전송이 실패했습니다. 다시 시도해 주십시오.");
                        }
                }
        })
        .fail(function () {
                alert("서버 에러: 인증코드 전송 실패");
        });
}

function checkEmailAuth () {
        const email = $("#email").val();
        const authCode = $("#authCode").val();

        if (codeSendedEmail !== email) {
                alert("이메일을 다시 작성해서 인증코드를 전송하세요.");
                return;
        }
        codeCheckedEmail = email;

        $.ajax({
                url: "/auth/verify/email",
                method: "POST",
                dataType: "json",
                data: { authCode: authCode, purpose: "register" }
        })
        .done(function (data) {
                if (data.success) {
                        alert("인증에 성공했습니다.");
                        unAuthemail = false;
                } else {
                        alert("인증에 실패했습니다. 다시 시도해 주세요.");
                        unAuthemail = true;
                }
        })
        .fail(function () {
                alert("서버 에러: 인증코드 인증 실패");
        });
}

function validateInput () {
        const userID = $("#userID").val();
        const password = $("#password").val();
        submitNowEmail = $("#email").val();

        if (userID.length < 1 || userID.length > 15 || /\s/.test(userID)) {
                alert("아이디는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(userID)) {
                alert("아이디는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }

        //처음 입력한것과 후에 입력한것의 아이디가 같은지 체크.
        if (userID !== lastCheckedID) {
                alert("아이디를 다시 중복 확인해주세요.");
                return false;
        }

        if (isDuplicated) {
                alert("아이디 중복 확인을 해주세요.");
                return false;
        }

        if (password.length < 1 || password.length > 15 || /\s/.test(password)) {
                alert("비밀번호는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
                alert("비밀번는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }

        //이메일 인증 검사
        if (unAuthemail) {
                alert("이메일 인증 확인을 다시 해주세요.");
                return false;
        }

        //하나라도 다르면 재인증 요망
        if (codeSendedEmail !== codeCheckedEmail || codeCheckedEmail !== submitNowEmail || submitNowEmail !== codeSendedEmail) {
                alert("이메일을 다시 입력해서 인증해주세요.");
                return false;
        }

        return true;
}

$(document).ready(function () {
  // 아이디 중복 확인 버튼 클릭
  $('#checkDuplicateBtn').on('click', function () {
    checkDuplicate();
  });

  // 인증코드 발송 버튼 클릭
  $('#sendAuthNumBtn').on('click', function () {
    sendAuthNum();
  });

  // 이메일 인증 확인 버튼 클릭
  $('#checkEmailAuthBtn').on('click', function () {
    checkEmailAuth();
  });

  // 폼 제출 시 유효성 검사
  $('#registerForm').on('submit', function (e) {
    if (!validateInput()) {
      e.preventDefault(); // 유효성 실패 시 폼 제출 막기
    }
  });
});


/*
let isDuplicated = true;
let lastCheckedID = "";

let unAuthemail = true;
let lastCheckedEmail = "";

function checkDuplicate () {
        const userID = $("#userID").val();

        if (userID.length < 1 || userID.length > 15 || /\s/.test(userID)) {
                alert("아이디는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(userID)) {
                alert("아이디는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }


        $.ajax({
                url: "/login/id_check",
                method: "POST",
                dataType: "json",
                data: { userID: userID }
        })
        .done(function (data) {
                if (data.exists) {
                        alert("이미 존재하는 아이디입니다.");
                        isDuplicated = true;
                        lastCheckedID = "";
                } else {
                        alert("사용 가능한 아이디입니다.");
                        isDuplicated = false;
                        lastCheckedID = userID;
                }
        })
        .fail(function () {
                alert("서버 에러: 중복 확인 실패");
        });
}

function sendAuthNum () {
        const email = $("#email").val();

        $.ajax({
                url: "/login/send_email_authID",
                method: "POST",
                dataType: "json",
                data: { email: email }
        })
        .done(function (data) {
                if (data.success) {
                        alert("인증코드를 전송했습니다.");
                } else {
                        if (data.isEmailExist) {
                                alert("이미 사용중인 이메일입니다.");
                        } else {
                                alert("인증코드 전송이 실패했습니다. 다시 시도해 주십시오.");
                        }
                }
        })
        .fail(function () {
                alert("서버 에러: 중복 확인 실패");
        });
}

function checkEmailAuth () {
        const email = $("#email").val();
        const authCode = $("#authCode").val();

        $.ajax({
                url: "/login/check_email_authID",
                method: "POST",
                dataType: "json",
                data: { authCode: authCode }
        })
        .done(function (data) {
                if (data.success) {
                        alert("인증에 성공했습니다.");
                        unAuthemail = false;
                        lastCheckedEmail = email;
                } else {
                        alert("인증에 실패했습니다. 다시 시도해 주세요.");
                        unAuthemail = true;
                        lastCheckedEmail = "";
                }
        })
        .fail(function () {
                alert("서버 에러: 중복 확인 실패");
        });
}

function validateInput () {
        const userID = $("#userID").val();
        const password = $("#password").val();
        const email = $("#email").val();

        if (userID.length < 1 || userID.length > 15 || /\s/.test(userID)) {
                alert("아이디는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(userID)) {
                alert("아이디는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }

        //처음 입력한것과 후에 입력한것의 아이디가 같은지 체크.
        if (userID !== lastCheckedID) {
                alert("아이디를 다시 중복 확인해주세요.");
                return false;
        }

        if (isDuplicated) {
                alert("아이디 중복 확인을 해주세요.");
                return false;
        }

        if (password.length < 1 || password.length > 15 || /\s/.test(password)) {
                alert("비밀번호는 1~15자이며 공백이 없어야 합니다.");
                return false;
        }

        // 영문 검사
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
                alert("비민번는 반드시 영문자를 포함하고, 숫자 및 특수문자는 선택 사항입니다.");
                return false;
        }

        //이메일 인증 검사
        if (unAuthemail) {
                alert("이메일 인증 확인을 다시 해주세요.");
                return false;
        }

        //이메일 인증후 이메일 입력을 바꿨을 때 차단.
        if (email !== lastCheckedEmail) {
                alert("이메일을 다시 입력해서 인증해주세요.");
                return false;
        }

        return true;
}

*/