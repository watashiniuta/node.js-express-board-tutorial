function validateInput () {



    return true;
}

$(document).ready(function () {
    $('#myprofileDeleteForm').on('submit', function (e) {
        if(!confirm('정말 탈퇴 하시겠습니까?')) {
            e.preventDefault();
        }
    });

    $('#myprofilePutForm').on('submit', function (e) {
        if (!validateInput()) {
            e.preventDefault(); // 유효성 실패 시 폼 제출 막기
        }
    });
})