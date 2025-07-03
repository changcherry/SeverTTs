import React from "react";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";
import "semantic-ui-css/components/dropdown.min.css";
import config from "../../config";

export const 取得新網址 = (語句, 腔) => {
  if (config.全部腔口().length > 1) {
    return (
      `/%E8%AC%9B/${腔}/${encodeURI(語句)}`);
  }
  return (
    `/%E8%AC%9B/${encodeURI(語句)}`);
};

const 更新網址 = (語句, 腔) =>
  browserHistory.replace(取得新網址(語句, 腔));

class 查表格 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: config.全部腔口().length > 1,
      menu: null,
      current語句: props.語句, // 新增：追蹤輸入框的當前值
    };
  }

  // 元件掛載後立即觸發初始查詢
  componentDidMount() {
    const { 語句, 腔, requestSearch } = this.props;
    requestSearch(語句, 腔); // 根據初始 props 執行查詢
    this.setState({ menu: this.getMenu() });
  }

  // 當外部 props (語句或腔) 更新時，觸發查詢和網址更新
  componentDidUpdate(prevProps) {
    const { 語句, 腔, requestSearch } = this.props;

    if (語句 !== prevProps.語句 || 腔 !== prevProps.腔) {
      requestSearch(語句, 腔);
      更新網址(語句, 腔);
    }
  }

  取得腔值() {
    const { 腔 } = this.props;
    return (this.refSelect && this.refSelect.value) ?
      this.refSelect.value : 腔;
  }

  // 處理 textarea 內容改變，只更新 state
  handle語句Change = (e) => {
    this.setState({ current語句: e.target.value });
  }

  // 當 textarea 失去焦點時，觸發查詢和網址更新
  handle語句Blur = () => {
    const { current語句 } = this.state;
    const 腔值 = this.取得腔值();
    
    // 只有當 current語句 有內容且與當前 props.語句 不同時才觸發查詢
    // 避免空值查詢或不必要的重複查詢
    if (current語句 && current語句 !== this.props.語句) {
        this.props.requestSearch(current語句, 腔值);
        更新網址(current語句, 腔值);
    }
  }

  // 當腔口下拉選單改變時，直接觸發查詢和網址更新
  handle腔Change = (e) => {
    const new腔 = e.target.value;
    const { current語句 } = this.state; // 使用當前輸入框的值
    this.props.requestSearch(current語句, new腔);
    更新網址(current語句, new腔);
  }

  getMenu() {
    const { showSelect } = this.state;
    const { 腔 } = this.props;
    if (showSelect) {
      return (
        <select defaultValue={腔}
          ref={(c) => { this.refSelect = c; }}
          className="ui dropdown"
          onChange={this.handle腔Change} // 新增 onChange 事件處理
        >
          {
            config.全部腔口().map((t, k) => (
              <option value={t} key={k}>{t}</option>
            ))
          }
        </select>
      );
    }
    return null;
  }

  render() {
    const { menu, current語句 } = this.state;
    // 移除 正在查詢 prop 在這裡的直接使用，因為沒有按鈕來控制其 disabled 狀態

    return (
      <div className='ui form'> {/* 不再是 <form> 標籤 */}

        {menu} {/* 腔口選擇器 */}

        <div className="app block">
          <textarea
            value={current語句}             // 由 state 控制 textarea 的值
            onChange={this.handle語句Change}   // 輸入時更新 state
            onBlur={this.handle語句Blur}       // 失去焦點時觸發查詢
            ref={(c) => { this.refText = c; }}
            rows='3'
            placeholder="請輸入您想查詢的語句..." // 增加提示文字
          />
        </div>

        {/* 查詢按鈕已移除 */}
      </div>
    );
  }
}

查表格.propTypes = {
  語句: PropTypes.string.isRequired,
  腔: PropTypes.string.isRequired,
  正在查詢: PropTypes.bool.isRequired, // 保留此 prop，因為 requestSearch 仍可能更新它
  requestSearch: PropTypes.func.isRequired,
};

export default 查表格;