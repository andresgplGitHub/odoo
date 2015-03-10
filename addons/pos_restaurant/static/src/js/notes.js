odoo.define('pos_restaurant.notes', ['point_of_sale.models', 'point_of_sale.screens', 'web.core'], function (require) {
"use strict";

console.log("notes");

var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');

var QWeb = core.qweb;
var _t   = core._t;

var _super_orderline = models.Orderline.prototype;

models.Orderline = models.Orderline.extend({
    initialize: function(attr, options) {
        _super_orderline.initialize.call(this,attr,options);
        this.note = this.note || "";
    },
    set_note: function(note){
        this.note = note;
        this.trigger('change',this);
    },
    get_note: function(note){
        return this.note;
    },
    can_be_merged_with: function(orderline) {
        if (orderline.get_note() !== this.get_note()) {
            return false;
        } else {
            return _super_orderline.can_be_merged_with.call(this,orderline);
        }
    },
    clone: function(){
        var orderline = _super_orderline.clone.call(this);
        orderline.note = this.note;
        return orderline;
    },
    export_as_JSON: function(){
        var json = _super_orderline.export_as_JSON.call(this);
        json.note = this.note;
        return json;
    },
    init_from_JSON: function(json){
        _super_orderline.init_from_JSON.apply(this,arguments);
        this.note = json.note;
    },
});

var OrderlineNoteButton = screens.ActionButtonWidget.extend({
    template: 'OrderlineNoteButton',
    button_click: function(){
        var line = this.pos.get_order().get_selected_orderline();
        if (line) {
            this.gui.show_popup('textarea',{
                title: _t('Add Note'),
                value:   line.get_note(),
                confirm: function(note) {
                    line.set_note(note);
                },
            });
        }
    },
});

screens.define_action_button({
    'name': 'orderline_note',
    'widget': OrderlineNoteButton,
    'condition': function(){
        return this.pos.config.iface_orderline_notes;
    },
});

});
