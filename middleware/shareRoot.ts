/**
 * 对 req.url 进行裁剪，以便适应不同的发布路径
 */
import express from 'express'
import IMVC from '../index'

type ShareRoot = (rootPath: string) => express.RequestHandler

const shareRoot: ShareRoot = (rootPath) => {
  if (rootPath.charAt(rootPath.length - 1) === '/') {
    rootPath = rootPath.substr(0, rootPath.length - 1)
  }

  const ROOT_RE = new RegExp('^' + rootPath, 'i')
  const handler: IMVC.RequestHandler = (req: IMVC.Req, res: IMVC.Res, next: express.NextFunction) => {
    if (ROOT_RE.test(req.url)) {
      req.url = req.url.replace(ROOT_RE, '')
      req.basename = rootPath
      if (req.url.charAt(0) !== '/') {
        req.url = '/' + req.url
      }
    } else if (!req.basename) {
      req.basename = ''
    }
    next()
  }
  return (handler as express.RequestHandler)
}

export default shareRoot