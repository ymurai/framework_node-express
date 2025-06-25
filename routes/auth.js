var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

// 認証情報（通常はデータベースから取得）
// テスト用のメールアドレス: test@mail.com
// テスト用のパスワード: password
const testUser = {
  email: 'test@mail.com',
  // パスワード 'password' をハッシュ化したもの
  passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
};

// パスワードハッシュを生成するためのヘルパー関数（開発時用）
async function generatePasswordHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// ログイン認証API
router.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;

    // バリデーション
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'メールアドレスとパスワードが必要です'
      });
    }

    // ユーザー確認（通常はデータベースから検索）
    if (email !== testUser.email) {
      return res.status(401).json({
        success: false,
        message: '認証に失敗しました'
      });
    }

    // パスワード照合
    const isValidPassword = await bcrypt.compare(password, testUser.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '認証に失敗しました'
      });
    }

    // 認証成功
    res.json({
      success: true,
      message: 'ログインに成功しました',
      user: {
        email: testUser.email
      }
    });

  } catch (error) {
    console.error('ログイン処理エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました'
    });
  }
});

module.exports = router;