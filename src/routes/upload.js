const router = require("express").Router();
const upload = require("../service/upload");


router.post("/file", [upload.single("image")], async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
            return res.json({ status: 0, link: "" });
        } else {
            const url = `http://localhost:5000/api/v1/upload/images/${file.filename}`;
            return res.json({ status: 1, url: url });
        }
    } catch (error) {
        console.log("Upload image error: ", error);
        return res.json({ status: 0, link: "" });
    }
});

router.post("/files", [upload.array("image", 9)], async (req, res, next) => {
    try {
        const { files } = req;
        if (!files) {
            return res.json({ status: 0, link: [] });
        } else {
            const url = [];
            for (const singleFile of files) {
                url.push(
                    `http://localhost:5000/api/v1/upload/images/${singleFile.filename}`,
                );
            }
            return res.json({ status: 1, url: url });
        }
    } catch (error) {
        console.log("Upload image error: ", error);
        return res.json({ status: 0, link: [] });
    }
});

router.get("/images/:name", (req, res) => {
    res.sendFile(`${process.cwd()}/public/images/${req.params.name}`);
});

module.exports = router;