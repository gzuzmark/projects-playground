import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import fs from "fs"

const videos = [
    {
      id: 0,
      poster: '/video/0/poster',
      duration: '3 mins',
      name: 'Sample 1'
    },
    {
      id: 1,
      poster: '/video/1/poster',
      duration: '4 mins',
      name: 'Sample 2'
    },
    {
      id: 2,
      poster: '/video/2/poster',
      duration: '2 mins',
      name: 'Sample 3'
    },
  ];

const videoRouter = router({
    all: publicProcedure.query(() => {
        return videos;
    }),

    byId: publicProcedure.input(z.number()).query(({input}) => {
        return videos.filter((vid) => vid.id === input)
    }),

    video: publicProcedure.input(z.number()).query(({ctx, input}) => {
        const path = `assets/${input}.mp4`;
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const { range } = ctx.req.headers
        if(range) {
            console.log('we have range', range);
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0] || "", 10)
            const end = parts[1] 
              ? parseInt(parts[1], 10)
              : fileSize-1
              console.log(parts)
            const chunksize = (end-start)+1
            const file = fs.createReadStream(path, {start, end})
            const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4',
            }
            console.log("Write head")
            ctx.res.writeHead(206, head);
            file.pipe(ctx.res);
        } else {
            console.log('no range', range);
            const head = {
              'Content-Length': fileSize,
              'Content-Type': 'video/mp4',
            }
            ctx.res.writeHead(200, head)
            fs.createReadStream(path).pipe(ctx.res)
          }

    })
})


export { videoRouter }