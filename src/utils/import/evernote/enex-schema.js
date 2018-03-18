import schema from 'joi-browser';

import dateIsoRegexp from 'utils/date-iso-regexp';

/**
 * Schema for Evernote Note Export Format, 1.0
 * http://xml.evernote.com/pub/evernote-export2.dtd
 */
export default schema.object({
  enExport: schema.object({
    note: schema.array().items(
      schema.object({
        title: schema.string(),
        content: schema.string(),
        created: schema
          .string()
          .regex(dateIsoRegexp)
          .optional(),
        resource: schema
          .array()
          .items(
            schema.object({
              data: schema.object({
                _: schema.string(),
                encoding: schema.string()
              }),
              mime: schema.string(),
              resourceAttributes: schema
                .object({
                  fileName: schema.string().optional()
                })
                .optional()
            })
          )
          .optional()
      })
    )
  })
});
