<?php
/**
 * Print an array's information
 * @param array $arr Array to be presented
 * @return void Echo's the information stored in the array
 */
function presentArray(array $arr)
{
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
}

/**
 * Function to store string between tags
 * @param string $string String to be stored between tags
 * @param string $tag HTML tag you want to store between
 * @return string String with text between tags
 */
function putInTags(string $string, string $tag): string
{
    return '<'.$tag.'>'.$string.'</'.$tag.'>';
}