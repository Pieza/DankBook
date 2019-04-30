import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { addPost } from '../../actions/post.actions'
import { IMAGE, VIDEO } from '../../../utils/enums/media-types'

class AddPostForm extends Component {
    constructor() {
        super()
        this.state = {
            description: '',
            image: null,
            image_preview: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this)
        this.onFileChange = this.onFileChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors })
    }

    onChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    onFileChange(e) {
        this.setState({ image: e.target.files[0], image_preview: URL.createObjectURL(e.target.files[0]) });
    }

    onSubmit(e) {
        e.preventDefault()

        const { user } = this.props.auth
        const formData = new FormData()

        formData.append('user_id', user.id)
        formData.append('description', this.state.description)

        if(this.state.image){
            formData.append('media_string', JSON.stringify({ type: IMAGE }))
            formData.append('file', this.state.image)
        }

        this.props.addPost(formData)
        this.setState({ description: '', image: null })
    }

    render() {
        const { errors } = this.state
        const { isAuthenticated, user } = this.props.auth

        return (
            <div className="row">
                <div className="col-sm-12 col-md-7">
                    <div className="card post-item">
                        <form onSubmit={this.onSubmit}>
                            <div className="card-body">
                                <div className="form-row">
                                    <div className="form-group col-sm-1 mb-0">
                                        <img className="avatar-navbar" src={user.avatar}></img>
                                    </div>
                                    <div className="form-group col-sm-11 mb-0">
                                        <input type='text' name="description" placeholder="Type something..." onChange={this.onChange} className={classnames('form-control', {
                                            'is-invalid': errors.description})}/>
                                        { errors.description && (<div className="invalid-feedback">{errors.description}</div>) }
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <div>
                                        { this.state.image ? <img width="20%" height="20%" src={this.state.image_preview}/> : null }
                                    </div>
                                    {/* <div className="custom-file">
                                        <input type='file' name="image" onChange={this.onFileChange} className={classnames('custom-file-input', {
                                            'is-invalid': errors.image})}/>
                                        <label className="custom-file-label">Choose file...</label>
                                        { errors.image && (<div className="invalid-feedback">{errors.image}</div>)}
                                    </div> */}
                                </div>
                            </div>

                            <div className="card-footer" style={{padding: "0rem"}}>
                                <div className="row">
                                    <div className="col-sm-6 mb-0">
                                        <label className="btn btn-primary mb-0">
                                            <i className="material-icons">image</i>
                                            <input type="file" name="image" onChange={this.onFileChange} hidden></input>
                                        </label>
                                    </div>
                                    <div className="col-sm-6 mb-0">   
                                        <button type="submit" className="btn btn-primary btn-block mb-0 float-right">
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

AddPostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { addPost })(AddPostForm)