import React from "react";
import PropTypes from "prop-types";
import {
  Block,
  ButtonStack,
  CopyButton,
  DownloadButton,
  PlayButton,
  意傳服務,
} from "demo-ui";
import Container漢羅列表 from "../顯示/漢羅列表.container";
import 計算複製內容 from "../../utils/複製";

class 翻譯結果 extends React.Component {
  取得複製鈕群() {
    const { 正在查詢, 發生錯誤 } = this.props;
    let { 綜合標音 } = this.props;
    綜合標音 = 綜合標音 || [];
    let 複製內容 = {};
    if (!正在查詢 && !發生錯誤 && 綜合標音.length > 0) {
      複製內容 = 計算複製內容(綜合標音);
    }

    const 複製鈕群 = [];
    Object.keys(複製內容).forEach((key) => {
      複製鈕群.push(
        <CopyButton key={key} 複製內容={複製內容[key]} 按鈕名={key}/>,
      );
    });
    return 複製鈕群;
  }

  取得整段音檔網址() {
    let { 綜合標音, 分詞 } = this.props;
    綜合標音 = 綜合標音 || [];
    if (綜合標音.length > 0) {
      分詞 = 分詞 || "";
      const { 腔口 } = this.props;
      return 意傳服務.語音合成({ 腔口, 分詞 });
    }
    return null;
  }

  render() {
    const { 正在查詢, 發生錯誤 } = this.props;
    const 複製鈕群 = this.取得複製鈕群();
    const audioSrc = this.取得整段音檔網址();
    return (
      <div>
        {
          (正在查詢 &&
              <h1 className='ui header'>載入中……</h1>
          )
        }
        {
          (發生錯誤 &&
              <h1 className='ui red header'>主機發生錯誤</h1>
          )
        }
        <div style={{ opacity: 正在查詢 ? 0.3 : 1 }}>
          <div
            className='ui icon red label'>
            <i className='icon-docs'/>
                  Khóo-pi(Copy)結果：
          </div>
          <ButtonStack>
            {複製鈕群}
          </ButtonStack>
          {audioSrc && <audio src={audioSrc} autoPlay />}
          <Container漢羅列表/>
        </div>
      </div>
    );
  }
}

翻譯結果.propTypes = {
  腔口: PropTypes.string.isRequired,
  正在查詢: PropTypes.bool.isRequired,
  發生錯誤: PropTypes.bool.isRequired,
  分詞: PropTypes.string.isRequired,
  綜合標音: PropTypes.arrayOf(PropTypes.shape({
    分詞: PropTypes.string.isRequired,
    漢字: PropTypes.string.isRequired,
    KIP: PropTypes.string.isRequired,
  })),
};

export default 翻譯結果;
