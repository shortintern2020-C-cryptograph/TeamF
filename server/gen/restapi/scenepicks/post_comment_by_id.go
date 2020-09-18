// Code generated by go-swagger; DO NOT EDIT.

package scenepicks

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"

	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
)

// PostCommentByIDHandlerFunc turns a function with the right signature into a post comment by Id handler
type PostCommentByIDHandlerFunc func(PostCommentByIDParams) middleware.Responder

// Handle executing the request and returning a response
func (fn PostCommentByIDHandlerFunc) Handle(params PostCommentByIDParams) middleware.Responder {
	return fn(params)
}

// PostCommentByIDHandler interface for that can handle valid post comment by Id params
type PostCommentByIDHandler interface {
	Handle(PostCommentByIDParams) middleware.Responder
}

// NewPostCommentByID creates a new http.Handler for the post comment by Id operation
func NewPostCommentByID(ctx *middleware.Context, handler PostCommentByIDHandler) *PostCommentByID {
	return &PostCommentByID{Context: ctx, Handler: handler}
}

/*PostCommentByID swagger:route POST /dialog/{id}/comment postCommentById

PostCommentByID post comment by Id API

*/
type PostCommentByID struct {
	Context *middleware.Context
	Handler PostCommentByIDHandler
}

func (o *PostCommentByID) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		r = rCtx
	}
	var Params = NewPostCommentByIDParams()

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request

	o.Context.Respond(rw, r, route.Produces, route, res)

}

// PostCommentByIDBody post comment by ID body
//
// swagger:model PostCommentByIDBody
type PostCommentByIDBody struct {

	// comment
	Comment string `json:"comment,omitempty"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostCommentByIDBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// comment
		Comment string `json:"comment,omitempty"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Comment = props.Comment
	return nil
}

// Validate validates this post comment by ID body
func (o *PostCommentByIDBody) Validate(formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *PostCommentByIDBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostCommentByIDBody) UnmarshalBinary(b []byte) error {
	var res PostCommentByIDBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// PostCommentByIDOKBody post comment by ID o k body
//
// swagger:model PostCommentByIDOKBody
type PostCommentByIDOKBody struct {

	// message
	Message string `json:"message,omitempty"`

	// schema
	Schema []*models.Comment `json:"schema"`
}

// UnmarshalJSON unmarshals this object while disallowing additional properties from JSON
func (o *PostCommentByIDOKBody) UnmarshalJSON(data []byte) error {
	var props struct {

		// message
		Message string `json:"message,omitempty"`

		// schema
		Schema []*models.Comment `json:"schema"`
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&props); err != nil {
		return err
	}

	o.Message = props.Message
	o.Schema = props.Schema
	return nil
}

// Validate validates this post comment by ID o k body
func (o *PostCommentByIDOKBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateSchema(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *PostCommentByIDOKBody) validateSchema(formats strfmt.Registry) error {

	if swag.IsZero(o.Schema) { // not required
		return nil
	}

	for i := 0; i < len(o.Schema); i++ {
		if swag.IsZero(o.Schema[i]) { // not required
			continue
		}

		if o.Schema[i] != nil {
			if err := o.Schema[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("postCommentByIdOK" + "." + "schema" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (o *PostCommentByIDOKBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *PostCommentByIDOKBody) UnmarshalBinary(b []byte) error {
	var res PostCommentByIDOKBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}