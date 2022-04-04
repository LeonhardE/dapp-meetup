import React, { Component } from 'react';

export class UploadImage extends Component {

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="content col-md-4">
            </div>
            <div className="content col-md-4">
              <h2>Submit Event</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const title = this.title.value
                const description = this.description.value
                const time = this.time.value
                const location = this.location.value
                const maxNum = this.maxNum.value
                this.props.uploadImage(title, description, time, location, maxNum)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                    <input
                      id="standard-textarea"
                      ref={(input) => { this.title = input }}
                      label="Title"
                      placeholder="Title"
                      multiline
                      variant="standard"
                    />
                    <br></br><br></br>
                    <input
                      id="outlined-multiline-static"
                      ref={(input) => { this.description = input }}
                      label="Description"
                      placeholder="description"
                      multiline
                      rows={8}
                    />
                    <br></br>
                    <input
                      id="standard-textarea"
                      ref={(input) => { this.time = input }}
                      label="Time"
                      placeholder="time"
                      multiline
                      variant="standard"
                    />
                    <input
                      id="standard-textarea"
                      ref={(input) => { this.location = input }}
                      label="Location"
                      placeholder="location"
                      multiline
                      variant="standard"
                    />
                    <input
                      id="standard-textarea"
                      ref={(input) => { this.maxNum = input }}
                      label="maxNum"
                      placeholder="max #participants"
                      multiline
                      variant="standard"
                    />
                    
                  </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg">Submit</button>
              </form>
            </div>
          <div className="content col-md-4">
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default UploadImage;