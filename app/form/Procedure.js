/**
 * Widget to render to Main view
 */

Ext.define('cardioCatalogQT.form.Procedure', {
    extend: 'Ext.form.Panel',
    alias : 'widget.procedureForm',
    config: {
        variableHeights: false,
        title: 'Procedures',
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
            title: 'Selected Px',
            itemId: 'procedure',
            fieldName: 'description',
            valueField:'code',
            viewConfig: {
                deferEmptyText: false,
                emptyText: 'No Px selected'
            },
            // TODO: fix ability to remove selected items when box is unchecked
            search: {
                field: 'description',
                store: 'Procedures',

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
            handler: 'onSubmitProcedures'
        }]
    }
});
