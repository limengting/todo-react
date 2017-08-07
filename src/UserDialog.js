import React, { Component } from 'react'
import './UserDialog.css'
import { signUp, signIn, sendPasswordResetEmail } from './leanCloud'
import SignInForm from './SignInForm'
import ForgotPasswordForm from './ForgotPasswordForm'
export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp',
            selected: 'signInOrSignUp',
            formData: {
                email: '',
                username: '',
                password: ''
            }
        }
    }

    switch(e) {
        this.setState({
            selected: e.target.value
        })
    }
    signUp(e) {
        e.preventDefault();
        let { email, username, password } = this.state.formData
        let success = (user) => {
            this.props.onSignUp.call(null, user)
        }
        let error = (error) => {
            switch (error.code) {
                case 202: alert('用户名已被占用')
                    break
                default:
                    alert('error')
                    break
            }

        }
        signUp(email, username, password, success, error)
    }
    signIn(e) {
        e.preventDefault();
        let { username, password } = this.state.formData
        let success = (user) => {
            this.props.onSignIn.call(null, user)
        }
        let error = (error) => {
            switch (error.code) {
                case 210: alert('用户名与密码不匹配')
                    break
                case 211: alert('找不到用户')
                    break
                default:
                    alert('error')
                    break
            }
        }
        signIn(username, password, success, error)
    }
    changeFormData(key, e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }



    render() {
        let signUpForm = (
            <form className="signUp" onSubmit={this.signUp.bind(this)}> {/* 注册*/}
                <div className="row">
                    <label>邮箱</label>
                    <input type="text" value={this.state.formData.email}
                        onChange={this.changeFormData.bind(this, 'email')} />
                </div>
                <div className="row">
                    <label>用户名</label>
                    <input type="text" value={this.state.formData.username}
                        onChange={this.changeFormData.bind(this, 'username')} />
                </div>
                <div className="row">
                    <label>密码</label>
                    <input type="password" value={this.state.formData.password}
                        onChange={this.changeFormData.bind(this, 'password')} />
                </div>
                <div className="row actions">
                    <button type="submit">注册</button>
                </div>
            </form>
        )

        let signInOrSignUp = (
            <div className="signInOrSignUp">
                <nav>
                    <label>
                        <input type="radio" value="signUp"
                            checked={this.state.selected === 'signUp'}
                            onChange={this.switch.bind(this)}
                        /> 注册</label>
                    <label>
                        <input type="radio" value="signIn"
                            checked={this.state.selected === 'signIn'}
                            onChange={this.switch.bind(this)}
                        /> 登录</label>
                </nav>
                <div className="panes">
                    {this.state.selected === 'signUp' ? signUpForm : null}
                    {this.state.selected === 'signIn' ? <SignInForm formData={this.state.formData}
                        onChange={this.changeFormData.bind(this)}
                        onSubmit={this.signIn.bind(this)}
                        onForgotPassword={this.showForgotPassword.bind(this)}
                    /> : null}
                </div>
            </div>
        )
     
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrSignUp' ?
                    signInOrSignUp :
                    <ForgotPasswordForm
                    formData={this.state.formData}
                    onSubmit={this.resetPassword.bind(this)}
                    onChange={this.changeFormData.bind(this)}
                    onSignIn={this.returnToSignIn.bind(this)}
                    />}
                </div>
            </div>
        )
    }
    showForgotPassword() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'forgotPassword'
        this.setState(stateCopy)
    }
    returnToSignIn() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'signInOrSignUp'
        this.setState(stateCopy)
    }
    resetPassword(e) {
        e.preventDefault()
        sendPasswordResetEmail(this.state.formData.email)
    }
}