/**
 * Widget to render to Main view
 */

Ext.define('cardioCatalogQT.form.Medication', {
    extend: 'Ext.form.Panel',
    alias : 'widget.medicationForm',
    config: {
        variableHeights: false,
        title: 'Medications',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            anchor: '25%',
            labelWidth: 100
        },
        items: [{
            width: 100,
            xtype: 'multiselector',
            title: 'Selected Rx',
            itemId: 'medication',
            fieldName: 'description',
            valueField:'code',
            viewConfig: {
                deferEmptyText: false,
                emptyText: 'No Rx selected'
            },
            // TODO: fix ability to remove selected items when box is unchecked
            search: {
                field: 'description',
                store: 'Medications',

                search: function (text) {
                    cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                }
            }
        }],
        lbar:[{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitMedications'

        }]
    }

});
